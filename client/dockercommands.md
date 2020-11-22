### after creating Dockerfile and .dockerignore

docker build -t ivanmitkov/client .

docker push ivanmitkov/client

# for using getInitialProps

### get namespaces

kubectl get namespace
the result is NAME STATUS AGE

default Active 9d

ingress-nginx Active 7d2h

kube-node-lease Active 9d

kube-public Active 9d

kube-system Active 9d

### get services running in ingress-nginx

kubectl get services -n ingress-nginx

the result is :

NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE

ingress-nginx-controller LoadBalancer 10.97.74.140 localhost 80:30587/TCP,443:30628/TCP 7d2h

ingress-nginx-controller-admission ClusterIP 10.96.82.30 <none> 443/TCP 7d2h

### we are trying to reach LoadBalancer

## to use axios from inside pod to reach to ingress-nginx in order to made request

#### from client pod reach to ingress and from there to the pod with needed route

http://[service_name].[name_of_the_namespace].svc.cluster.local/[url_service]

http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser
