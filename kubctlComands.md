# Create secret in kubernetes

kubectl create secret generic [name of the secret] --from-literal=[key]=[value]

kubectl create secret generic jwt-secret --from-literal=jwt=dsds

kubectl get secret

## reach directly into service DB

1. kubectl get pods

get the name of the pod that is running our db instance
orders-mongo-depl-786c66f857-hc52r

2. kubectl exec -it orders-mongo-depl-786c66f857-hc52r mongo

now we have mongo shell
