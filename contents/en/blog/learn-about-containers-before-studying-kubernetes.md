---
name: 'learn-about-containers-before-studying-kubernetes'
trans: 'learn-about-containers-before-studying-kubernetes'
id: 'learn-about-containers-before-studying-kubernetes'
title: Learning containers before studying Kubernetes

year: 2 June 2020
isTextColorDark: true
category: 'kubernetes'
description: |
  What are containers? Why do you need them?
---

### Why do you need container?

I didn't know much about containers, so one of the things I struggled with during my Diagnomics internship is the server environment. At the time, the library version used by each program developed by the company was different, and it was difficult to set the environment. As a beginner to Linux, I then carried an Ubuntu bootable USB in my pocket to re-install the OS if anything went wrong.

Docker has appeared in the world to solve these kinds of problems.  
Docker allows you to run each application in a container with isolated environments.

- Now the developer only has to develop the application and turn it into a docker container.
- You can efficiently create and share an execution environment image based on the union mount<sup>1)</sup>.
- The early version of Docker used [LXC](https://linuxcontainers.org/) as it was, but later developed a libcontainer that directly executes cgroups and namespace APIs, and can run without LXC, and now uses runC created through refactoring libcontainer.

### What are containers?

- Completely isolated environments
- Own processes, services, networking interfaces, mounts just like virtual machine(except OS kernel)
- Processes executed as containers share the kernel, but are executed in isolation using kernel functions such as namespace<sup>2)</sup>, cgroups<sup>3)</sup>, and root directory isolation.
- For the host machine, it runs as a process and from the container's point of view, it looks like a virtual machine with a separate environment.

### Then, how are containers and virtual machines different?

<image-responsive imageURL="blog/learn-about-containers-before-studying-kubernetes/1.png" width="100%" alt="container-vs-virtual-machine"/>

- Virtual machines have their own OS.
- The container has no OS, so it has less overhead and is lightweight. Therefore, the image size is small and booting and distribution are fast.
- What is Hypervisor?
  - Intermediate layer that converts the physical resources of the machine into virtual resources that can be used by the virtual machine. It provides virtualized hardware, virtualized network interface, and virtual CPU to implement a virtual machine and access virtual hardware through Guest Kernel. (a lot of virtualization...)
  - Virtual machines operate with each OS on it.
  - It runs on the Host OS.
- Since containers are not completely isolated, only containers with the same kernel can be used.
  - For example, you can use containers such as CentOS, Debian, Fedora, etc. on Ubuntu, but you cannot use Windows containers because the kernel is different.

### Disadvantages of containers

- File system: The virtual machine uses storage by using ext3 and ext4 on the block device. Containers use Union filesystems such as AUFS, Device mapper, Overlay Filesystem, etc. It is slow because it has to go up on filesystems like ext4, record changes, and restore original data from the recorded contents. Although the problem can be solved by separating the reading and writing of data into a general file system or using a COW file system such as Btrfs or ZFS, there are many things to consider compared to a virtual machine.
- Network configuration: At the host operating system level, the network has to be abstracted once more, so there is much more to pay attention to the network configuration than the virtual machine.

### What is a container and what is an image?

- You can create multiple containers from a single image.
- Running image instance === Container

### Getting used to the container

Developing and deploying applications using containers can save time.

Case 1 - Deploying new versions of application

1. `docker build new image`
2. Push a new image to the image repository. `docker push new image`
3. Pull new image from the image repository `docker pull new image`
4. Run new container with new image `docker run new image`
5. Repeat 3-4 as many as the number of servers.

Case 2 - Decided to add more servers due to increased traffic

1. Adding new servers
2. `docker pull image` in new server
3. `docker run image`
4. Connect a new server to the load balancer that distributes traffic.

Case 3 - Decided to reduce the number of servers due to the reduced traffic

1. Disconnect the server to be deleted from the load balancer
2. Kill the server

Every time you update, every time there's a change in traffic, simple tasks keep repeating.... Annoying... Network traffic monitoring can be done by a computer, so I want the computer to judge it properly to increase or decrease the number of servers. When deploying updates, I want the computer to take care of them one by one and distribute them without interruption... Kubernetes was born with this desire from infrastructure managers...!!!!!

## Of course, there are other Container Orchestration systems. Kubernetes is the most used and has many references, so I'm going to study it.

### appendix. Terminology

- <sup>1)</sup> Union mount
  > By mounting multiple directories on a single directory, it looks like a single unified directory. Used in docker for image implementation. It improves the speed by using the cache during the image build process.
- <sup>2)</sup> Linux namespaces
  > This function is used to control access to Linux resources of a specific process. The namespace is divided into IPC namespace, mount namespace, network namespace, process ID namespace, user namespace, UTS namespace, and control group namespace for each resource. Processes running on the system share the namespace of the init process by default, but it is possible to separate namespaces by resource using system calls or unshare commands.
- <sup>3)</sup> cgroup
  > This is a function of the Linux kernel that controls the CPU, memory, network bandwidth, and disk I/O available to the process in groups. Each process is divided into groups and controlled through namespace separation. It allows you to control separation at a higher level. For each process belonging to each namespace, it acts like one machine itself. LXC was created through cgroup.
- Linux capabilities
  > Control process privileges. Linux processes are largely divided into privileged processes running with root authority (user ID 0) and non-privileged processes executed by ordinary users (other than user ID 0). Linux capabilities allow you to subdivide root privileges and apply them to processes. In the container runtime, if some root privileges are required, Linux capability is used to specify the required privileges.

---

### References

- [What is a Linux container?](https://www.44bits.io/ko/keyword/linux-container)
- [Kubernetes for the Absolute Beginners - Hands-on](https://www.udemy.com/course/learn-kubernetes/)
- [Post about Docker](https://rokrokss.com/post/2019/10/17/%EB%8F%84%EC%BB%A4-Docker-%EC%A0%95%EB%A6%AC.html)
- [Kubernetes Up & Running](http://www.yes24.com/Product/Goods/61335395)
- [[Kubernetes Service] What is the trend of the cloud market, Kubernetes?](https://www.youtube.com/watch?v=JNc11rxLtmE)
