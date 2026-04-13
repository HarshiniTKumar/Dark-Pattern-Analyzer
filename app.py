from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch
import torch.nn.functional as F

app = Flask(__name__)
CORS(app)

MODEL_PATH = r'C:\Users\harsh\OneDrive\Desktop\darkpattern_nlp\model\saved'
tokenizer = DistilBertTokenizer.from_pretrained(MODEL_PATH)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

id2label = {
    0: 'Urgency',
    1: 'Not Dark Pattern',
    2: 'Scarcity',
    3: 'Misdirection',
    4: 'Social Proof',
    5: 'Other Dark Pattern'
}

def predict(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = F.softmax(outputs.logits, dim=1)
    confidence, predicted = torch.max(probs, dim=1)
    label = id2label[predicted.item()]
    return {
        'text': text,
        'label': label,
        'confidence': round(confidence.item(), 3),
        'is_dark_pattern': label != 'Not Dark Pattern'
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data or 'texts' not in data:
        return jsonify({'error': 'Send JSON with a texts array'}), 400
    texts = data['texts']
    if not isinstance(texts, list):
        return jsonify({'error': 'texts must be a list'}), 400
    results = [predict(t) for t in texts]
    dark_patterns = [r for r in results if r['is_dark_pattern']]
    return jsonify({
        'total': len(results),
        'dark_patterns_found': len(dark_patterns),
        'results': results
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)