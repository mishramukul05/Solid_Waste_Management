import os
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from PIL import Image
import torch
from torchvision import transforms, models
import torch.nn as nn

# Set up paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pth")

print("Initializing Python Prediction Server...")
print("Loading PyTorch model into memory (this will only happen once)...", flush=True)

# Load model ONCE
model = models.resnet18(pretrained=False)
model.fc = nn.Linear(model.fc.in_features, 2)
model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
model.eval()

print("Model successfully loaded.", flush=True)

classes = ["Clean", "Dirty"]
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

class PredictionHandler(BaseHTTPRequestHandler):
    # Suppress default logging to stdout
    def log_message(self, format, *args):
        pass

    def do_POST(self):
        if self.path == '/predict':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data)
                img_path = data.get('image_path')
                
                if not img_path or not os.path.exists(img_path):
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Invalid image path"}).encode('utf-8'))
                    return
                    
                # Do the prediction
                img = Image.open(img_path).convert("RGB")
                img = transform(img).unsqueeze(0)

                with torch.no_grad():
                    output = model(img)
                    _, pred = torch.max(output, 1)

                result = classes[pred.item()]
                
                # Send the response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'prediction': result}).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

def run_server(port=5001):
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, PredictionHandler)
    print(f"Prediction server running and listening on port {port}...", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

if __name__ == '__main__':
    # You can pass the port as a command line argument if needed
    import sys
    port = 5001
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    run_server(port)
