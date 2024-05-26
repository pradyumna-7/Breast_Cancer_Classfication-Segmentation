from flask import Flask, request, jsonify
from PIL import Image
import io
import torch
import torch.nn as nn
from torchvision import transforms
import torchvision.models as models
from flask_cors import CORS  # Import CORS
from tensorflow.keras.applications.imagenet_utils import preprocess_input
from tensorflow.keras import layers
from tensorflow.keras.applications import EfficientNetB0
import numpy as np
import tensorflow as tf1



def build_model(num_classes):
    NUM_CLASSES = 3
    IMG_SIZE = 224
    inputs = layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    # x = img_augmentation(inputs)
    x = inputs
    model = EfficientNetB0(include_top=False, input_tensor=x, weights="imagenet")

    # Freeze the pretrained weights
    model.trainable = False

    # Rebuild top
    x = layers.GlobalAveragePooling2D(name="avg_pool")(model.output)
    x = layers.BatchNormalization()(x)

    top_dropout_rate = 0.2
    x = layers.Dropout(top_dropout_rate, name="top_dropout")(x)
    outputs = layers.Dense(NUM_CLASSES, activation="softmax", name="pred")(x)

    # Compile
    model = tf1.keras.Model(inputs, outputs, name="EfficientNet")
    optimizer = tf1.keras.optimizers.Adam(learning_rate=1e-2)
    model.compile(
        optimizer=optimizer, loss="categorical_crossentropy", metrics=["accuracy"]
    )
    return model


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/', methods=['GET'])
def home():
    return 'Welcome to the Image Classification API!'


@app.route('/predict_llm', methods=['POST'])
def predict_llm():
    try:

        # Define the device
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # Load the saved model state dict
        path = 'preTrainedVit_50_epochs_.pth'
        pretrained_vit_state_dict = torch.load(path, map_location=device)

        # Setup a ViT model instance with pretrained weights
        pretrained_vit = models.vit_b_16().to(device)

        # Rename the keys in the loaded state dict to match the keys in the model's state dict
        new_pretrained_vit_state_dict = {}
        for k, v in pretrained_vit_state_dict.items():
            if 'head' in k:
                k = k.replace('head', 'heads')  # Rename keys related to the classifier head
            new_pretrained_vit_state_dict[k] = v

        # Load the modified state dict into the model
        pretrained_vit.load_state_dict(new_pretrained_vit_state_dict, strict=False)

        # Freeze the base parameters
        for parameter in pretrained_vit.parameters():
            parameter.requires_grad = False

        # Change the classifier head
        class_names = ['benign', 'malignant', 'normal']
        pretrained_vit.conv_proj.in_channels = 1
        pretrained_vit.heads = nn.Linear(in_features=768, out_features=len(class_names)).to(device)

        # Define the transformations for the input image
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

        # Read the image file from request data
        image_data = request.files['image']

        # Convert binary data to PIL Image
        image = Image.open(image_data).convert('RGB')

        # Preprocess the image
        input_image = transform(image).unsqueeze(0).to(device)

        # Set the model to evaluation mode
        pretrained_vit.eval()

        # Make prediction
        with torch.no_grad():
            outputs = pretrained_vit(input_image)

        # Get predicted class index
        _, predicted = torch.max(outputs, 1)

        # Map the predicted index to class label
        predicted_class = class_names[predicted.item()]

        # Return the prediction as JSON
        return jsonify({'prediction': predicted_class})

    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/predict_DL', methods=['POST'])
def predict_DL():
    try:
        # Read the image file from request data
        image_data = request.files['image']

        # Convert binary data to PIL Image
        image = Image.open(image_data).resize((224, 224))

        path = "Efficient_Net_Final.weights.h5"

        NUM_CLASSES = 3

        model = build_model(num_classes=NUM_CLASSES)

        model.load_weights(path)

        x = np.expand_dims(image, axis=0)
        x = preprocess_input(x)

        # Predict class labels
        preds = model.predict(x)
        class_labels = ['benign', 'malignant', 'normal']
        max_index = np.argmax(preds[0])
        predicted_class = class_labels[max_index]

        # Return the prediction as JSON
        return jsonify({'prediction': predicted_class})

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')