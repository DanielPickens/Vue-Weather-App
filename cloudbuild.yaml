steps:
# Build the container image
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', 'gcr.io/cicd-pipeline-334604/alpine', 'src']
  timeout: 180s

#Push the image
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', 'gcr.io/$cicd-pipeline-334604/myapp:v1']

- name: 'gcr.io/cloud-builders/gcloud'
  entrypoint: "bash"
  args:
  - "-c"
  - |
    echo "Docker Container Built"
    ls -la
    ls -al models/
# deploy container image to GKE
- name: "gcr.io/cloud-builders/gke-deploy"
  args:
  - run
  - --filename=K8s/
  - --image=gcr.io/$cicd-pipeline-334604/myapp:v1
  - --location=us-west1-b
  - --cluster=mykube
