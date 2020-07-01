---
name: 'kubernetes-concepts'
trans: 'kubernetes-concepts'
id: 'kubernetes-concepts'
title: Kubernetes Concepts
year: 1 July 2020
isTextColorDark: true
category: 'kubernetes'
description: |
  Container orchestration, Kubernetes Architecture and Practices
---

## What is Container Ochestration?

Optimizing and automating the deployment process of multiple containers is called container orchestration. To look at three of the most popular tools today,

- Docker Swarm: Easy, but lacks auto scailing
- Kubernetes: Most famous, difficult to get started, available on cloud services (GCP, Azure, AWS)
- Apache Mesos: It's hard to get started, but there are many features

I'm trying to learn Kubernetes which is the most used. 🤓

<br/><br/>

## Kubernetes Architecture

Kubernetes consists of a master node that manages the cluster and a worker node where containers are deployed. It calls the master node's API and the worker nodes communicate with the master to perform the necessary tasks.
<image-responsive imageURL="blog/kubernetes-concepts/1.png" width="100%" alt="master-node"/>

- Node (Minion): Physical or virtual machine with Kubernetes installed, where containers will be deployed, also known as worker nodes.
- Cluster: Node group, allowing one node to access another node even if it dies. If there are many nodes, the load can be distributed, and the above figure is a cluster.
- Master: It is one of the nodes where Kubernest is installed, but it is set as the master. It is responsible for monitoring other nodes and orchestration Worker Nodes.

<br/><br/>

## What makes up Kubernetes

- API Server: It is provided to use the Kubernetes function externally.
- etcd: key store. Stores data for cluster management in key-value format. It is responsible for implementing lock so that there are no collisions between nodes.
- Kubelet: Make sure the container works properly on each node.
- Container Runtime: Program used to run the container. Docker is also one type.
- Controller: Backbone of the orchestration. Verify that the node, container, or end point is working properly.
- Scheduler: It allows multiple nodes to perform tasks evenly.

### Master - Worker Node

<image-responsive imageURL="blog/kubernetes-concepts/2.png" width="100%" alt="worker-node"/>

<br/><br/>

## Running local

- [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)  
  Since it is difficult to separately configure the Master and Worker nodes in local machine, a cluster in which the Master and Worker nodes are combined is used.
  <image-responsive imageURL="blog/kubernetes-concepts/3.png" width="100%" alt="master-worker"/>

  <image-responsive imageURL="blog/kubernetes-concepts/4.png" width="100%" alt="minikube"/>

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)  
  Command tool for managing Kubernetes clusters. Can be used like this:

  ```
  kubectl run hello-minikube
  kubectl cluster-info
  kubectl get nodes
  ```

<br/><br/>

## Kubernetest Resources (Objects)

Kubernetes has many kinds of Resources. (49 types as of June 27, 2020)  
[List of Kubernetes Resources](https://kubernetes.io/docs/reference/kubectl/overview/#resource-types)
We will try to make Pod, ReplicaSet, and Deployment, which are the most basic of them, and take time to understand each resource.

There are many ways Kubernetes manages Objects (Resources). I will practice using [YAML](https://en.wikipedia.org/wiki/YAML) Configuration File.

### Pods

- Kubernetes does not distribute containers directly to nodes, but wraps them in a Kubernetes object called Pod.
- It is the smallest object that can be made in Kubernetes.
- Pods usually have only one container, but sometimes they have multiple containers. For example, if you need a helper container to process data entered by the user or a file uploaded by the user.
- Containers within Pods are created together and die together.

The YAML file for Kubernetes Object Management has 4 Root Properties.

- apiVersion: Kubernetes API version
- kind: Resource Type
- metadata: information about the object
- spec: what object to make

Let's create a pod containing a container that uses nginx images.

```yaml
# pod-definition.yaml

apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
    type: front-end
spec:
  containers:
    - name: nginx-container
      image: nginx
```

Create a Pod using the v1 version of the Kubernetes API. The name of this pod is `myapp-pod` and this pod has labels `app: myapp` and `type: front-end`.
As you can see from the spec, this Pod contains a container named nginx-container created using the image nginx.
Simply put, it looks like this:
<image-responsive imageURL="blog/kubernetes-concepts/6.png" width="100%" alt="pod-definition"/>

Let's make it yourself using the kubectl command! (The minikube is running in local machine.)

```bash
kubectl create -f pod-definition.yaml
```

<image-responsive imageURL="blog/kubernetes-concepts/7.png" width="100%" alt="create-pod"/>

As intended, one Pod is created and running.

### Replication Controllers and ReplicaSets

<image-responsive imageURL="blog/kubernetes-concepts/8.png" width="100%" alt="replicas"/>

As the number of requests increases/decreases, multiple pods are created for high availability and efficiency. An object that manages multiple pods of the same type is a Replication Controller or ReplicaSet.
ReplicaSet is a new object developed to improve Replication Controller. You can easily see the difference by looking at the YAML file.

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: myapp-rc
  labels:
    app: myapp
    type: front-end
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: example
template:
  ## metadata and spec parts of the pod-definition
```

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: myapp-replicaset
  labels:
    app: myapp
    type: front-end
  spec:
    replicas: 3
    selector:
      matchExpressions:
        - { key: app, operator: In, values: [example1, example2, rs] }
        - { key: teir, operator: NotIn, values: [production] }
template:
  ## metadata and spec parts of the pod-definition
```

The apiVersion, kind are different, but the biggest difference is the selector part.
In the case of the Replication Controller, only Pods whose label matches completely can be grouped into one set, whereas ReplicaSet can set various conditions, which is useful for grouping already running Pods into one set.

Let's create a ReplicaSet containing 3 nginx pods created above.

```yaml
# replicaset-definition.yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: myapp-replicaset
  labels:
    app: myapp
    type: front-end
spec:
  replicas: 3
  selector:
    matchLabel:
      type: front-end
  template:
    metadata:
      name: myapp-pod
      labels:
        app: myapp
        type: front-end
    spec:
      containers:
        - name: nginx-container
          image: nginx
```

If there is a Pod whose label is `type: front-end`, include it in ReplicaSet, and if additional creation is needed, create a new Pod using spec > template information.  
⭐️ Therefore, the label information of the template must match the selector information. ⭐️

```base
kubectl create -f replicaset-definition.yaml
```

<image-responsive imageURL="blog/kubernetes-concepts/9.png" width="100%" alt="create-replicaset"/>

Since there is one myapp-pod created above, you can see that only two pods are created.
Really keep three? I'm curious, so let's delete one.
<image-responsive imageURL="blog/kubernetes-concepts/10.png" width="100%" alt="delete-pod"/>
ReplicaSet is working hard to keep 3 pods! 😆

### How to scale

Let's increase the number of pods to 6. There are two ways.

1. After changing the replicas of the YAML file to 6
   ```bash
   kubectl replace -f replicase-definition.yaml
   ```
2. Using commands `scale`
   ```bash
   kubectl scale --replicas=6 --f replicaset-definition.yaml
   ```
   or
   ```bash
   kubectl scale --replicas=6 replicaset myapp-replicaset
   ```

In case 2, it is simple, but it is difficult to manage because the number of pods actually created is different from the information defined in the `replicaset-definition.yaml` file. Let's use the first way!

<image-responsive imageURL="blog/kubernetes-concepts/11.png" width="100%" alt="scale-pod"/>

### Deployments

With Kubernetes' Deployment Object, containers deployed in real production can be updated one by one without interruption. This is called Rolling Update. It also provides a rollback function that reverts to a previous version if there is a problem after updating.

<image-responsive imageURL="blog/kubernetes-concepts/12.png" width="100%" alt="revision"/>

Deployment is also created by a YAML file.

```yml
# deployment-definition.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  labels:
    app: myapp
    type: front-end
spec:
  template:
    metadata:
      name: myapp-pod
      labels:
        app: myapp
        type: front-end
    spec:
      containers:
        - name: nginx-container
          image: nginx
  replicas: 3
  selector:
    matchLabels:
      type: front-end
```

```bash
kubectl create -f deployment-definition.yaml
```

It looks similar to ReplicaSet.

<image-responsive imageURL="blog/kubernetes-concepts/13.png" width="100%" alt="create-deployment"/>

### How to upgrade

`deployment-definition.yaml` Change the image information of the file from nginx -> nginx:1.9.1.

<image-responsive imageURL="blog/kubernetes-concepts/14.png" width="100%" alt="upgrade-image"/>

You can see how Upgrade works by looking at the events below. A new ReplicaSet is created and the number of Pods of the existing ReplicaSet is reduced by one.
ReplicaSet's Rollout method includes Rolling Update where the number of Pods is changed one by one as above, and Recreate where a new Pod is created after all Pods are deleted.
The default method is Rolling Update.

<image-responsive imageURL="blog/kubernetes-concepts/15.png" width="100%" alt="describe-pod"/>

If you look at the information of the newly created pod, you can see that the nginx version has changed.  
Let's try using the Rollback function that returns to the previous version. Use the command below to go back to before upgrading.

```bash
kubectl rollout undo deployment/myapp-deployment
```

<image-responsive imageURL="blog/kubernetes-concepts/16.png" width="100%" alt="undo"/>

If you check the ReplicaSet list, the number of Pods of the previously created ReplicaSet is only 0, but it is not disappearing. After undo, the number of Pods of the first ReplicaSet created increases.

<image-responsive imageURL="blog/kubernetes-concepts/17.png" width="100%" alt="after-undo"/>

### What if the image doesn't exist? 🤔

What if I upgrade the image information after changing it to nginx:12.34.56?
<image-responsive imageURL="blog/kubernetes-concepts/18.png" width="100%" alt="wrong-image"/>

Over time, the number of pods in the new deployment does not increase.

<image-responsive imageURL="blog/kubernetes-concepts/19.png" width="100%" alt="pod-status"/>

You can see what's wrong with the status of the newly created pod. ImagePullBackOff. There is a problem, so roll back to the previous deployment by using `undo`.

### Wrap-up

```bash
kubectl get all
```

Using the above command, you can check all running objects at once.

<image-responsive imageURL="blog/kubernetes-concepts/20.png" width="100%" alt="get-all"/>

In Kubernetes, you wrap it with a pod and then run the container. And for scaling of Pod, execute Replication Controller or ReplicaSet. In addition, Deployment is executed for Revision management of Replication Controller or ReplicaSet (image version upgrade, downgrade).

It looks complicated, but it doesn't seem too difficult because I understand the need to wrap objects one by one.

### Next Step 🐥

In order to use the actual Kubernetes cluster, there are still more areas to study, such as Kubernetes' network and services.

<br/><br/>

---

### References

- [What is the difference between ReplicaSet and ReplicationController?](https://stackoverflow.com/questions/36220388/what-is-the-difference-between-replicaset-and-replicationcontroller)
- [Kubernetes for the Absolute Beginners - Hands-on](https://www.udemy.com/course/learn-kubernetes/)
