# create temporary connection

### intead of using clusterIp or access service from outside node with NodePort

kubectl port-forward nats-depl-5fd7f56cfd-kkps4 4222:4222

### first port 4222 is the port on the local mashine, the second port on the pod

then from other terminal in nats-test folder

yarn run publish

and from other terminal

yarn run listen
