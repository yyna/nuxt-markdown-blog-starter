---
name: 'kubernetes-concepts'
trans: 'kubernetes-concepts'
id: 'kubernetes-concepts'
title: Kubernetes 큰그림 훑기
year: 1 July 2020
isTextColorDark: true
category: 'kubernetes'
description: |
  컨테이너 오케스트레이션, 쿠버네티스를 구성하고 있는 것들에 대해서 알아보고 간단한 실습을 진행해봅니다.
---

[지난 포스트](https://yyna.dev/blog/learn-about-containers-before-studying-kubernetes)에서는 쿠버네티스를 본격적으로 공부하기에 앞서 컨테이너가 왜 필요한지에 대해 알아봤습니다.

[쿠버네티스 홈페이지](https://kubernetes.io/)에 가보면 다음과 같이 쿠버네티스를 설명하고 있습니다.

> Kubernetes (K8s) is an open-source system for automating deployment, scaling, and management of containerized applications.

풀어 설명하고 있는 자동 배포, 스케일링, 컨테이너 관리를 한 단어로 정의하면 바로 `Container Ochestration` 입니다. 그렇습니다. 쿠버네티스는 컨테이너 오케스트레이션 툴입니다.

컨테이너 오케스트레이션 툴 중 가장 많이 쓰이는 3가지 툴의 특성을 알아보자면,

- Docker Swarm: 쉽지만 Auto scailing 기능이 조금 부족한 편
- Kubernetes: 가장 유명함, 처음 시작하기엔 어려운 편, 클라우드 서비스(GCP, Azure, AWS) 에서 사용할 수 있음
- Apache Mesos: 처음 시작하기 어렵지만 많은 기능이 있음

그 중 가장 많이 쓰이는 그리고 핫한 🔥 쿠버네티스에 대해 알아보려 합니다.

<br/><br/>

## Kubernetes Architecture

쿠버네티스는 전체 클러스터를 관리하는 마스터와 컨테이너가 배포되는 노드로 구성되어 있습니다. 모든 명령은 마스터의 API 서버를 호출하고 노드는 마스터와 통신하면서 필요한 작업을 수행합니다.
<image-responsive imageURL="blog/kubernetes-concepts/1.png" width="100%" alt="master-node"/>

- Node (Minion): Kubernetes가 설치된 물리 또는 가상머신, 컨테이너가 배포될 곳, Worker Node 라고도 합니다.
- Cluster: Node 그룹, 한 노드가 죽어도 다른 노드에 접근할 수 있도록 합니다. Node가 많으면 로드를 분산할 수 있고, 위 그림이 하나의 클러스터라고 볼 수 있습니다.
- Master: Kubernetes가 설치된 노드 중 하나이나 마스터로 설정된 노드입니다. 다른 노드들을 모니터링하고 Worker Node들을 오케스트레이션 하는 일을 담당합니다.

<br/><br/>

## 쿠버네티스를 구성하고 있는 것들

- API 서버: 외부에서 쿠버네티스 기능을 사용하기 위해서 제공됩니다.
- etcd: Key store. 클러스터 관리를 위한 데이터들을 key-value 형태로 저장합니다. 여러 노드 사이에 충돌이 없도록 Lock을 구현하는 역할을 맡고있습니다.
- Kubelet: 각 노드에서 컨테이너가 제대로 작동하도록 합니다.
- Container Runtime: 컨테이너를 실행시키는데 사용되는 프로그램입니다. 도커가 여기에 해당됩니다.
- Controller: 오케스트레이션의 중추 역할을 합니다. 노드, 컨테이너 또는 End point가 제대로 작동하는지 확인합니다.
- Scheduler: 여러 노드들이 일을 나눠서 하도록 합니다.

### Master - Worker 노드

<image-responsive imageURL="blog/kubernetes-concepts/2.png" width="100%" alt="worker-node"/>

<br/><br/>

## 로컬에서 사용해보기

- [minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)  
  로컬에서는 Master, Worker 노드를 따로 구성하기가 번거롭기 때문에 Master와 Worker 노드가 합쳐진 형태의 minikube 클러스터를 사용해서 실습을 진행합니다.
  위 링크를 참고해서 설치합니다.

  <image-responsive imageURL="blog/kubernetes-concepts/3.png" width="100%" alt="master-worker"/>

  설치 후 아래 명령어를 사용해서 minikube를 실행합니다.

  ```
  minikube start
  ```

<image-responsive imageURL="blog/kubernetes-concepts/4.png" width="100%" alt="minikube"/>

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)  
  쿠버네티스 클러스터를 관리하기 위한 명령어 도구입니다. 다음과 같이 사용합니다.

  ```
  kubectl run hello-minikube
  kubectl cluster-info
  kubectl get nodes
  ```

<br/><br/>

## Kubernetest Resources (Objects)

쿠버네티스에는 많은 종류의 Resource가 있습니다. (2020년 6월 27일 기준 49개....)  
[List of Kubernetes Resources](https://kubernetes.io/docs/reference/kubectl/overview/#resource-types)
그 중 가장 기본이 되는 Pod, ReplicaSet, Deployment를 직접 만들어보고 각 Resource에 대해 이해해보려 합니다.

쿠버네티스가 Object(Resource)를 관리하는 방법은 여러가지가 있습니다. 저는 [YAML](https://en.wikipedia.org/wiki/YAML) Configuration File을 사용해서 실습을 진행합니다.

### Pods

- 쿠버네티스는 컨테이너를 노드에 직접 배포하지 않고 Pod 라는 쿠버네티스 오브젝트에 감싸서 배포한다.
- 쿠버네티스에서 만들 수 있는 가장 작은 단위이다.
- Pod는 주로 1개의 컨테이너만 가지지만 여러개의 컨테이너를 가지는 경우도 있다. 예를 들면 사용자가 입력한 데이터를 처리한다거나 사용자가 업로드한 파일을 처리하는 Helper 컨테이너가 필요할 경우이다.
- 한 Pod 내의 컨테이너 들은 함께 생성되고 죽는 운명의 공동체이다.

쿠버네티스 Object 관리를 위한 YAML 파일은 4가지 Root Property를 필수로 가집니다.

- apiVersion: 쿠버네티스 API 버전
- kind: Pod, Deployment 등의 Resource Type
- metadata: Object에 대한 데이터
- spec: 어떤 Object를 만들 것인가에 대한 정의

nginx 이미지를 사용하는 컨테이너를 포함하는 Pod을 만들어봅시다.

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

v1 버전의 쿠버네티스 API를 사용해서 Pod를 만듭니다. 이 Pod의 이름은 `myapp-pod`이며 `app: myapp`, `type: front-end` 라는 Label 정보를 가집니다.
spec에서 볼 수 있듯 이 Pod은 nginx라는 이미지를 사용해서 만들어진 nginx-container라는 이름을 가지는 컨테이너 하나를 포함합니다.
간단히 그림으로 표현하면 아래와 같습니다.
<image-responsive imageURL="blog/kubernetes-concepts/6.png" width="100%" alt="pod-definition"/>

kubectl 명령어를 사용해서 직접 만들어봅시다! (로컬에서 minikube가 실행 중입니다.)

```bash
kubectl create -f pod-definition.yaml
```

<image-responsive imageURL="blog/kubernetes-concepts/7.png" width="100%" alt="create-pod"/>

의도한대로 1개의 Pod이 생성되어 실행되고 있습니다.

### Replication Controllers and ReplicaSets

<image-responsive imageURL="blog/kubernetes-concepts/8.png" width="100%" alt="replicas"/>

요청의 증가/감소에 따라 높은 가용성과 효율성을 위해 여러 개의 Pod이 만들어지기도 합니다. 같은 형태의 여러 Pod을 관리하는 Object(위 그림에서 노란색 박스로 표시된 부분)가 Replication Controller 또는 ReplicaSet입니다.
ReplicaSet은 Replication Controller을 개선하기 위해 만들어진 새로운 Object 입니다. YAML 파일을 보면 그 차이를 쉽게 확인할 수 있습니다.

```yaml
## ReplicationController 의 YAML

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
  ## pod-definition의 metadata, spec 부분만 가져옴
```

```yaml
## ReplicaSet 의 YAML

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
  ## pod-definition의 metadata, spec 부분만 가져옴
```

두 YAML 파일의 apiVersion, kind가 다르지만 가장 큰 차이점은 selector 부분입니다.
Replication Controller의 경우 Label이 완전히 일치하는 Pod들만 하나의 세트로 묶을 수 있는 반면 ReplicaSet은 다양한 조건을 설정할 수 있어서 이미 실행 중인 Pod들을 하나의 세트로 묶기에 유용합니다.

위에서 생성한 nginx Pod 3개를 포함하는 ReplicaSet을 생성해봅시다.

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

label이 `type: front-end`인 Pod이 있으면 ReplicaSet에 포함시키고 추가 생성이 필요한 경우 spec > template 정보를 이용해서 새로운 Pod을 만들어 줍니다.  
⭐️ 따라서 template의 label 정보는 selector 정보와 일치해야 합니다. ⭐️

```
kubectl create -f replicaset-definition.yaml
```

<image-responsive imageURL="blog/kubernetes-concepts/9.png" width="100%" alt="create-replicaset"/>

위에서 만든 myapp-pod가 하나 있기 때문에 2개의 Pod만 더 생기는 모습을 볼 수 있습니다.
정말 3개를 유지할까요? 궁금하니 하나를 삭제해봅시다.

3개의 Pod을 유지하기 위해 ReplicaSet이 일을 열심히 해주고 있군요! 😆

<image-responsive imageURL="blog/kubernetes-concepts/10.png" width="100%" alt="delete-pod"/>

### How to scale 🏗

Pod 수를 6개로 늘려봅시다. 2가지 방법이 있습니다.

1. YAML 파일의 replicas를 6으로 변경 후
   ```bash
   kubectl replace -f replicase-definition.yaml
   ```
2. `scale` 명령어 사용
   ```bash
   kubectl scale --replicas=6 --f replicaset-definition.yaml
   ```
   또는
   ```bash
   kubectl scale --replicas=6 replicaset myapp-replicaset
   ```

2번의 경우 간단하지만 실제 만들어진 Pod의 수가 `replicaset-definition.yaml` 파일에 정의된 정보와 다르기 때문에 관리가 어려워집니다. **1번 방법을 사용합시다!**

<image-responsive imageURL="blog/kubernetes-concepts/11.png" width="100%" alt="scale-pod"/>

### Deployments

쿠버네티스의 Deployment Object를 사용하면 실제 production에 배포된 컨테이너들을 하나씩 중단없이 업데이트 할 수 있습니다. 이를 Rolling Update라고 합니다. 또한 업데이트 후 문제가 있을 경우 이전 버전으로 되돌아가는 Rollback 기능도 제공합니다.

<image-responsive imageURL="blog/kubernetes-concepts/12.png" width="100%" alt="revision"/>

Deployment 역시 YAML 파일로 생성합니다.

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

ReplicaSet과 비슷해 보입니다.

<image-responsive imageURL="blog/kubernetes-concepts/13.png" width="100%" alt="create-deployment"/>

### How to upgrade

`deployment-definition.yaml` 파일의 image 정보를 nginx -> nginx:1.9.1로 변경합니다.

<image-responsive imageURL="blog/kubernetes-concepts/14.png" width="100%" alt="upgrade-image"/>

아래 Events를 보면 Upgrade가 어떻게 동작하는지 확인할 수 있습니다. 새로운 ReplicaSet이 만들어지고 기존 ReplicaSet의 Pod 수를 하나씩 줄여가는 방식입니다.  
ReplicaSet의 Rollout 방식은 위처럼 하나씩 Pod 수가 변경되는 Rolling Update와 모든 Pod이 삭제된 후 새로운 Pod이 생성되는 Recreate가 있습니다.

default 방식은 Rolling Update입니다.

<image-responsive imageURL="blog/kubernetes-concepts/15.png" width="100%" alt="describe-pod"/>

새로 만들어진 Pod의 정보를 보면 nginx 버전이 변경된 걸 볼 수 있습니다.  
이전 버전으로 돌아가는 Rollback 기능도 한번 사용해봅시다. 아래 명령어를 사용하면 Upgrade 하기 전으로 되돌아갈 수 있습니다.

```bash
kubectl rollout undo deployment/myapp-deployment
```

<image-responsive imageURL="blog/kubernetes-concepts/16.png" width="100%" alt="undo"/>

ReplicaSet 목록을 확인하면 이전에 만들어진 ReplicaSet의 Pod 수가 0일 뿐이지 사라지지 않고 있습니다. undo 후 처음 만들어진 ReplicaSet의 Pod 수가 늘어납니다.

<image-responsive imageURL="blog/kubernetes-concepts/17.png" width="100%" alt="after-undo"/>

### 존재하지 않는 이미지일 경우? 🤔

image 정보를 nginx:12.34.56으로 변경 후 Upgrade를 하면 어떻게 될까요?

<image-responsive imageURL="blog/kubernetes-concepts/18.png" width="100%" alt="wrong-image"/>

시간이 계속 지나도 새로운 Deployment의 Pod 수가 늘어나지 않습니다.

<image-responsive imageURL="blog/kubernetes-concepts/19.png" width="100%" alt="pod-status"/>

새로 생성 중인 Pod의 상태를 보면 어떤 문제가 있는지 알 수 있습니다. ImagePullBackOff 입니다. 문제가 있으니 다시 undo를 통해 이전 Deployment로 Rollback을 해줍니다.

### 마무리

```bash
kubectl get all
```

위 명령어를 사용하면 실행 중인 모든 Object를 한번에 확인할 수 있습니다.

<image-responsive imageURL="blog/kubernetes-concepts/20.png" width="100%" alt="get-all"/>

쿠버네티스에서는 Pod으로 감싼 후 컨테이너를 실행합니다. 그리고 Pod의 Scaling을 위해 Replication Controller 또는 ReplicaSet 을 실행합니다. 그리고 Replication Controller 또는 ReplicaSet 의 Revision 관리(이미지 버전 업그레이드, 다운그레이드)를 위해 Deployment를 실행합니다.

복잡해보이지만 하나씩 감싸는 Object 의 필요를 이해하니 크게 어렵지 않아 보입니다.

### Next Step 🐥

아직 실제 쿠버네티스 클러스터 사용을 위해서는 쿠버네티스의 네트워크, 서비스 등 좀 더 공부할 부분이 남아있습니다.

<br/><br/>

---

### 글 작성을 위해 참고한 링크

- [What is the difference between ReplicaSet and ReplicationController?](https://stackoverflow.com/questions/36220388/what-is-the-difference-between-replicaset-and-replicationcontroller)
- [Kubernetes for the Absolute Beginners - Hands-on](https://www.udemy.com/course/learn-kubernetes/)
