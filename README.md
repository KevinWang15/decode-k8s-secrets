# Kubernetes Secret Decoder

A lightweight CLI tool that decodes Kubernetes Secret YAML files by converting base64-encoded `data` fields into human-readable `stringData` fields. Perfect for debugging, auditing, and managing Kubernetes secrets.

## Features

- 🚀 Fast streaming YAML processing for any file size
- 📄 Supports multiple YAML documents (separated by `---`)
- 📝 Handles both single Secrets and List resources
- 🔄 Automatically converts `data` to `stringData`
- ⚡ Zero configuration required
- 🛡️ Preserves original YAML structure
- ✨ Clean, human-readable output

## Prerequisites

- Node.js ≥ 12
- npm

## Installation

```bash
# Install from npm
npm install -g decode-k8s-secrets

# Or install from source
git clone https://github.com/KevinWang15/decode-k8s-secrets
cd decode-k8s-secrets
npm install
npm install -g .
```

## Usage

### Basic Usage

```bash
# Process a single file
cat secret.yaml | decode-k8s-secrets

# Direct from kubectl
kubectl get secret mysecret -o yaml | decode-k8s-secrets

# Process and save to file
cat secret.yaml | decode-k8s-secrets > decoded.yaml
```

### Example Inputs & Outputs

#### Single Secret

Input:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

Output:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
stringData:
  username: admin
  password: 1f2d1e2e67df
```

#### List of Secrets

Input:
```yaml
apiVersion: v1
items:
  - apiVersion: v1
    data:
      key1: dmFsdWUx
  - apiVersion: v1
    data:
      key2: dmFsdWUy
```

Output:
```yaml
apiVersion: v1
items:
  - apiVersion: v1
    stringData:
      key1: value1
  - apiVersion: v1
    stringData:
      key2: value2
```

## Limitations

- Processes only YAML with `data` fields
- Assumes valid YAML input format
- Does not validate secret values
- No encryption/decryption of values

## Contributing

Contributions are welcome! Please feel free to:

- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests

## License

MIT License