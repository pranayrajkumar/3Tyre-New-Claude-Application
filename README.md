# 3‑Tier Microservices App – Deployment with Argo CD, Prometheus & Grafana

## Overview
This repository contains a simple 3‑tier micro‑services demo (frontend, department‑service, employee‑service) containerised and ready for Kubernetes.

We replace the original Jenkins‑based CI pipeline with **GitHub Actions** and provide a full **monitoring stack** (Prometheus + Grafana) plus **GitOps deployment** using **Argo CD**.

---

## Prerequisites
| Tool | Version |
|------|---------|
| Docker | ≥ 20.10 |
| kubectl | ≥ 1.27 |
| Helm | ≥ 3.12 |
| GitHub repository (with **GitHub Actions** enabled) |
| Access to a container registry (Docker Hub, GHCR, etc.) |
| A Kubernetes cluster (any cloud or local **kind**/**minikube**) |

---

## 1. Set up the Kubernetes cluster
```bash
# Example with kind (local)
kind create cluster --name dev-cluster
kubectl config use-context kind-dev-cluster
```

# 2. Install Argo CD
```bash
# Install Argo CD in its own namespace
kubectl create namespace argocd
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
helm install argocd argo/argo-cd -n argocd
```

Access the UI (default admin password is the pod name):
```bash
kubectl -n argocd port-forward svc/argocd-server 8080:443
# Open https://localhost:8080 in a browser
```

---

## 3. Deploy Prometheus & Grafana via Helm
```bash
# Create a monitoring namespace
kubectl create namespace monitoring

# Add the Prometheus community repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  -n monitoring \
  --set grafana.enabled=true \
  --set prometheus-node-exporter.enabled=true
```

The Grafana UI will be exposed as a `ClusterIP` service `prometheus-grafana`. To port‑forward:
```bash
kubectl -n monitoring port-forward svc/prometheus-grafana 3000:80
# Open http://localhost:3000 (admin/admin)
```

Grafana is pre‑configured with a **Prometheus** data source pointing to `http://prometheus-operated.monitoring.svc:9090`.

---

## 4. Add GitHub Actions CI/CD workflow
Create the file `.github/workflows/ci-cd.yaml` (see below). The workflow:
1. Builds Docker images for **backend‑department**, **backend‑employee**, and **frontend**.
2. Pushes them to a registry (example uses Docker Hub).
3. Tags the commit SHA.
4. Optionally triggers an Argo CD sync via the **Argo CD CLI** (requires a GitHub secret with the CLI token).

---

## 5. Deploy the app with Argo CD (GitOps)
1. Push this repository to GitHub.
2. In the Argo CD UI, create a new **Application**:
   - **Project**: default
   - **Repository URL**: `https://github.com/<your‑org>/<repo>.git`
   - **Path**: `k8s`
   - **Cluster**: `https://kubernetes.default.svc`
   - **Namespace**: `new-3tier-app` (or any you prefer – edit `k8s/namespace.yaml` accordingly)
3. Save and **Sync**. Argo CD will apply all manifests (Deployments, Services, Ingress, Mongo statefulset, etc.).
4. Verify:
```bash
kubectl get pods -n employee-dir
kubectl get svc -n employee-dir
```

---

## 6. Verify monitoring
- Open Grafana (port‑forward as above) and import the **Kubernetes Cluster Monitoring** dashboard (ID 315). It shows CPU, memory, pod restarts, etc.
- The back‑end services expose a `/health` endpoint which Prometheus scrapes automatically because the `kube‑state‑metrics` collector already discovers `Pod` metrics.

---

## 7. Clean‑up
```bash
# Remove Argo CD
helm uninstall argocd -n argocd
kubectl delete namespace argocd

# Remove monitoring stack
helm uninstall prometheus -n monitoring
kubectl delete namespace monitoring

# Delete the app namespace
kubectl delete namespace employee-dir
```

---

## Important files added
- `.github/workflows/ci-cd.yaml` – GitHub Actions CI pipeline.
- Updated `k8s/*‑deploy.yaml` with **liveness/readiness probes** (already applied).
- `README.md` (this file) with full setup instructions.

Happy deploying! 🚀
