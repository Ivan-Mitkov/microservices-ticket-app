# Create secret in kubernetes

kubectl create secret generic [name of the secret] --from-literal=[key]=[value]

kubectl create secret generic jwt-secret --from-literal=jwt=dsds

kubectl get secret
