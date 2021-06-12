#### authenticate ourself

doctl auth init [api]

##### change used token

doctl auth init -t [token]

#### get connection info for the new cluster

doctl kubernetes cluster kubeconfig save [cluster_name]

###### set context to do-fra1-ticketing, the commands are run against this cluster

https://www.digitalocean.com/docs/kubernetes/how-to/connect-to-cluster/

###### see all nodes

kubectl get nodes

#### list all contexts

kubectl config view

#### use different context, swap between local cluster and DO cluster

kubectl config use-context [context_name]

#### manual secret jwt and stripe

##### Find which context we are running

kubectl config view

##### switch to DO context

kubectl config use-context [digital_ocean_context_name]

##### Manually create a secret on digital ocean

kubectl create secret generic jwt-secret --from-literal=[key in this keys jwt]=[value]
kubectl create secret generic stripe-secret --from-literal=[key in this keys STRIPE_KEY]=[value]

#### setup ingress-nginx

https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.47.0/deploy/static/provider/do/deploy.yaml

#### manualy commit and push to master /fot infra folder/

#### load balancer issues

https://github.com/digitalocean/digitalocean-cloud-controller-manager/blob/master/docs/controllers/services/examples/README.md#accessing-pods-over-a-managed-load-balancer-from-inside-the-cluster
