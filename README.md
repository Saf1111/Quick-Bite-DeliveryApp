<div align="center">

# 🍔 Quick-Bite Delivery App

### 🚀 End-to-End DevOps Deployment Project

**A production-style food delivery application deployed through a complete CI/CD and Kubernetes workflow.**

<p>
  <img src="https://img.shields.io/badge/Node.js-20+-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Docker-Containerized-blue?logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/Jenkins-CI%2FCD-red?logo=jenkins" alt="Jenkins">
  <img src="https://img.shields.io/badge/Kubernetes-Orchestrated-326CE5?logo=kubernetes" alt="Kubernetes">
  <img src="https://img.shields.io/badge/AWS-EKS-orange?logo=amazon-aws" alt="AWS EKS">
  <img src="https://img.shields.io/badge/Region-ap--south--1-yellow?logo=amazon-aws" alt="AWS Mumbai">
</p>

</div>

<p align="center">
  <a href="#-project-overview">Overview</a> •
  <a href="#-technologies-used">Tech Stack</a> •
  <a href="#-deployment-architecture">Architecture</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-final-verification">Verification</a>
</p>

---

> **DevOps Portfolio Project**
>
> This project demonstrates the complete journey from source code to a publicly accessible application using **GitHub → Jenkins → Docker → Docker Hub → AWS EKS → Kubernetes → AWS LoadBalancer**.

---

## 📚 Table of Contents

- [📌 Project Overview](#-project-overview)
- [🎯 What You Will Learn](#-what-you-will-learn)
- [🛠️ Technologies Used](#-technologies-used)
- [🏗️ Deployment Architecture](#-deployment-architecture)
- [📁 Project Structure](#-project-structure)
- [📋 Prerequisites](#-prerequisites)
- [☁️ AWS EC2 Setup](#️-aws-ec2-setup)
- [🔐 IAM Role and AWS Permissions](#-iam-role-and-aws-permissions)
- [☁️ AWS CLI Setup](#️-aws-cli-setup)
- [🟢 Install Node.js and npm](#-install-nodejs-and-npm)
- [🔗 Git and GitHub Setup](#-git-and-github-setup)
- [🐳 Docker Setup](#-docker-setup)
- [🧪 Test the Docker Container](#-test-the-docker-container)
- [🐳 Docker Hub Setup](#-docker-hub-setup)
- [🔧 Jenkins Setup](#-jenkins-setup)
- [📄 Jenkinsfile](#-jenkinsfile)
- [▶️ Jenkins Pipeline Execution](#️-jenkins-pipeline-execution)
- [☸️ AWS EKS Cluster Setup](#️-aws-eks-cluster-setup)
- [🚀 Kubernetes Deployment](#-kubernetes-deployment)
- [🌐 Kubernetes Service and LoadBalancer](#-kubernetes-service-and-loadbalancer)
- [✅ Final Verification](#-final-verification)

---

## 📌 Project Overview

This project demonstrates how a web application can be taken from source code to a live deployment using modern DevOps tools and practices.

The complete workflow used in this project is:

```text
Developer
   ↓
GitHub
   ↓
Jenkins
   ↓
Application Build
   ↓
Docker Image
   ↓
Docker Hub
   ↓
AWS EKS
   ↓
Kubernetes Deployment
   ↓
Kubernetes Pods
   ↓
LoadBalancer
   ↓
Live Application

## 🎯 What You Will Learn

By completing this project, you will learn how to:

- Manage source code using Git and GitHub
- Create a Jenkins CI pipeline
- Install dependencies and build a Node.js application
- Build and run Docker containers
- Create and manage Docker images
- Push Docker images to Docker Hub
- Create an AWS EKS Kubernetes cluster
- Use kubectl to manage Kubernetes resources
- Create Kubernetes Deployments
- Run multiple replicas of an application
- Create a Kubernetes LoadBalancer Service
- Expose an application through AWS
- Verify and troubleshoot a Kubernetes deployment
- Understand the basic DevOps deployment workflow

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| Git | Version control |
| GitHub | Source code repository |
| Jenkins | Continuous Integration (CI) |
| Node.js | Application runtime |
| npm | Dependency management |
| Vite | Application build tool |
| Docker | Containerization |
| Docker Hub | Docker image registry |
| AWS EC2 | DevOps server |
| AWS EKS | Managed Kubernetes cluster |
| Kubernetes | Container orchestration |
| kubectl | Kubernetes command-line tool |
| eksctl | EKS cluster management |
| AWS LoadBalancer | External application access |

## 🏗️ Deployment Architecture

```text
                ┌──────────────┐
                │    GitHub    │
                │ Source Code  │
                └──────┬───────┘
                      │
                      ▼
                ┌──────────────┐
                │    Jenkins   │
                │ CI Pipeline  │
                └──────┬───────┘
                      │
                      ▼
                ┌──────────────┐
                │    Docker    │
                │ Build Image  │
                └──────┬───────┘
                      │
                      ▼
                ┌──────────────┐
                │  Docker Hub  │
                └──────┬───────┘
                      │
                      ▼
            ┌─────────────────────────┐
            │       AWS EKS        │
            │   Kubernetes Cluster    │
            │                    │
            │   ┌─────┐    ┌─────┐    │
            │   │Pod 1│    │Pod 2│    │
            │   └─────┘    └─────┘    │
            │        ▲            │
            │        │            │
            │   Kubernetes Service    │
            └──────────┬──────────────┘
                    │
                    ▼
               AWS LoadBalancer
                    │
                    ▼
               Live Application

## 📁 Project Structure

```text
Quick-Bite-DeliveryApp/
│
├── src/
├── dist/
│
├── Dockerfile
├── Jenkinsfile
│
├── quick-bite-deployment.yaml
├── quick-bite-service.yaml
│
├── package.json
├── package-lock.json
├── server.ts
├── vite.config.ts
├── tsconfig.json
│
├── .dockerignore
├── .gitignore
└── README.md

## 📂 Important Files

| File                    | Description                            |
| ---------------------------- | --------------------------------------------- |
| `Dockerfile`              | Instructions for building the Docker image    |
| `Jenkinsfile`             | Defines the Jenkins CI pipeline            |
| `quick-bite-deployment.yaml` | Kubernetes Deployment configuration         |
| `quick-bite-service.yaml`    | Kubernetes LoadBalancer Service configuration |
| `package.json`            | Project dependencies and scripts            |
| `server.ts`               | Application server                       |
| `README.md`               | Project documentation                    |

## 📋 Prerequisites

Before starting this project, make sure you have:

- AWS Account
- GitHub Account
- Docker Hub Account
- Ubuntu EC2 instance
- IAM Role attached to the EC2 instance
- Basic Linux command knowledge
- Basic Git and GitHub knowledge

### Required Tools

The following tools are used in this project:

- Git
- Node.js
- npm
- Docker
- AWS CLI
- kubectl
- eksctl
- Jenkins

### AWS Region

This project uses the AWS Mumbai region:

    ap-south-1

## ☁️ AWS EC2 Setup

The EC2 instance is used as the main DevOps server for this project.

Jenkins, Docker, AWS CLI, kubectl, and eksctl are installed and used from this server.

### 1. Launch an EC2 Instance

Create an Ubuntu EC2 instance from the AWS Console.

Recommended:

- OS: Ubuntu
- Architecture: 64-bit
- Instance type: Suitable for the workload
- Storage: At least 20 GB
- Security Group: Allow SSH (22) and Jenkins (8080)

### 2. Connect to the EC2 Instance

From your local machine:

    ssh -i "YOUR-KEY.pem" ubuntu@<EC2-PUBLIC-IP>

### 3. Verify the Server

Check the current user:

    whoami

Expected output:

    ubuntu

Check the operating system:

    cat /etc/os-release

Check the system information:

    uname -a

## 🔐 IAM Role and AWS Permissions

The EC2 instance needs permission to access AWS services such as EKS.

For this project, an IAM Role is attached to the EC2 instance instead of storing AWS access keys on the server.

### 1. Create an IAM Role

Open the AWS IAM Console and create a role for EC2.

Select:

    AWS Service → EC2

Choose EC2 as the trusted entity and create the role.

Attach the required permissions for the AWS resources used in this project.

### 2. Attach the IAM Role to EC2

Go to:

    AWS Console → EC2 → Instances

Select the DevOps EC2 instance.

Then select:

    Actions → Security → Modify IAM role

Select the created IAM role and attach it to the EC2 instance.

### 3. Verify AWS Access

Run:

    aws sts get-caller-identity

If the IAM role is configured correctly, AWS will return the account and role information.

Example:

    UserId: AROA...:i-xxxxxxxxxxxxxxxxx
    Account: XXXXXXXXXXXX
    Arn: arn:aws:sts::XXXXXXXXXXXX:assumed-role/EKS_Role/i-xxxxxxxxxxxxxxxxx

The `Arn` should show the IAM role attached to the EC2 instance.

> Note: AWS Access Key ID and Secret Access Key are not required when the EC2 instance uses an IAM Role.

## ☁️ AWS CLI Setup

AWS CLI is used to communicate with AWS services from the EC2 server.

### 1. Check AWS CLI

Run:

    aws --version

If AWS CLI is installed correctly, the version will be displayed.

### 2. Verify AWS Authentication

Since the EC2 instance uses an IAM Role, verify the AWS identity:

    aws sts get-caller-identity

A successful response confirms that the EC2 instance can communicate with AWS.

### 3. Set the AWS Region

This project uses the Mumbai region:

    ap-south-1

You can check the current AWS configuration with:

    aws configure list

> Note: When an IAM Role is attached to the EC2 instance, AWS access keys do not need to be configured manually.

## 🟢 Install Node.js and npm

Node.js and npm are required to install the project dependencies and build the application.

### 1. Check Node.js

    node --version

### 2. Check npm

    npm --version

If Node.js and npm are already installed, you can continue to the next step.

### 3. Verify the Project

Go to the project directory:

    cd ~/Quick-Bite-DeliveryApp

Check the project files:

    ls -la

## 🔗 Git and GitHub Setup

Git is used for version control, while GitHub is used to store and manage the project source code.

### 1. Check Git

    git --version

### 2. Clone the Repository

If the project is not already available on the EC2 instance:

    git clone https://github.com/Saf1111/Quick-Bite-DeliveryApp.git

### 3. Enter the Project Directory

    cd Quick-Bite-DeliveryApp

### 4. Check the Repository

    git status

### 5. View the Remote Repository

    git remote -v

The remote repository should point to the Quick-Bite GitHub repository.

### 6. Pull the Latest Changes

Before working with the project, pull the latest changes:

    git pull origin main

## 🐳 Docker Setup

Docker is used to package the Quick-Bite application and its dependencies into a container image.

### 1. Check Docker

    docker --version

### 2. Check Docker Service

    sudo systemctl status docker

If Docker is not running:

    sudo systemctl start docker

Enable Docker to start automatically after reboot:

    sudo systemctl enable docker

### 3. Allow the Ubuntu User to Use Docker

Add the current user to the Docker group:

    sudo usermod -aG docker $USER

Apply the group change:

    newgrp docker

Verify:

    docker ps

### 4. Build the Docker Image

Make sure you are inside the project directory:

    cd ~/Quick-Bite-DeliveryApp

Build the image:

    docker build -t quick-bite:latest .

### 5. Check the Docker Image

    docker images

The Quick-Bite image should appear with the following name:

    quick-bite    latest

## 🧪 Test the Docker Container

Before deploying the application to Kubernetes, test the Docker image locally on the EC2 instance.

### 1. Run the Container

    docker run -d --name quick-bite -p 3000:3000 quick-bite:latest

### 2. Check the Running Container

    docker ps

The Quick-Bite container should show a `Running` status.

### 3. Check Container Logs

    docker logs quick-bite

Make sure the application starts without errors.

### 4. Test the Application

From the EC2 instance, check whether the application is responding:

    curl http://localhost:3000

If the application is working correctly, the HTML response from the application will be displayed.

### 5. Stop and Remove the Test Container

After testing:

    docker stop quick-bite

    docker rm quick-bite

## 🐳 Docker Hub Setup

Docker Hub is used as the container image registry for this project.

The Docker image is pushed to Docker Hub so that Kubernetes can pull the image and run it inside the EKS cluster.

### 1. Login to Docker Hub

    docker login

Enter your Docker Hub credentials when prompted.

### 2. Tag the Docker Image

Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username:

    docker tag quick-bite:latest YOUR_DOCKERHUB_USERNAME/quick-bite:latest

Example:

    docker tag quick-bite:latest safwan112/quick-bite:latest

### 3. Push the Image

    docker push YOUR_DOCKERHUB_USERNAME/quick-bite:latest

Example:

    docker push safwan112/quick-bite:latest

### 4. Verify the Image

Open your Docker Hub repository and verify that the `quick-bite:latest` image is available.

The Kubernetes Deployment will use this Docker Hub image later.

## 🔧 Jenkins Setup

Jenkins is used to automate the application build and deployment process.

The Jenkins pipeline will:

- Checkout the source code from GitHub
- Install project dependencies
- Build the application
- Build the Docker image
- Deploy the application

### 1. Check Jenkins

    sudo systemctl status jenkins

Jenkins should show:

    Active: active (running)

### 2. Access Jenkins

Jenkins runs on port `8080`.

Open the following in a browser:

    http://<EC2-PUBLIC-IP>:8080

Make sure port `8080` is allowed in the EC2 Security Group.

### 3. Create a Jenkins Pipeline

From the Jenkins dashboard:

    New Item
    → Enter item name
    → Select Pipeline
    → Create

Configure the pipeline to use the GitHub repository.

### 4. Configure Pipeline from SCM

Select:

    Pipeline
    → Definition: Pipeline script from SCM
    → SCM: Git

Enter the repository URL:

    https://github.com/Saf1111/Quick-Bite-DeliveryApp.git

Set the branch:

    */main

Jenkins will automatically use the `Jenkinsfile` from the repository.

### 5. Run the Pipeline

Click:

    Build Now

Jenkins will checkout the repository and execute the stages defined in the `Jenkinsfile`.

The pipeline should complete successfully before moving to the Kubernetes deployment.

## 📄 Jenkinsfile

The `Jenkinsfile` defines the CI/CD pipeline used by Jenkins.

The pipeline performs the following stages:

1. Checkout the source code from GitHub
2. Install application dependencies
3. Build the application
4. Build the Docker image
5. Deploy the Docker container

The Jenkinsfile used in this project is:

    pipeline {
       agent any

       stages {
          stage('Checkout') {
             steps {
                checkout scm
             }
          }

          stage('Install Dependencies') {
             steps {
                sh 'npm ci'
             }
          }

          stage('Build Application') {
             steps {
                sh 'npm run build'
             }
          }

          stage('Docker Build') {
             steps {
                sh 'docker build -t quick-bite:latest .'
             }
          }

          stage('Deploy') {
             steps {
                sh '''
                    docker stop quick-bite || true
                    docker rm quick-bite || true
                    docker run -d \
                     --name quick-bite \
                     -p 3000:3000 \
                     --restart unless-stopped \
                     quick-bite:latest
                '''
             }
          }
       }
    }

### Pipeline Flow

    GitHub
      ↓
    Checkout
      ↓
    npm ci
      ↓
    npm run build
      ↓
    Docker Build
      ↓
    Docker Container
      ↓
    Application Running

## ▶️ Jenkins Pipeline Execution

After configuring the Jenkins Pipeline, run the job from the Jenkins dashboard.

### 1. Start the Pipeline

Open the Jenkins job and select:

    Build Now

Jenkins will start executing the pipeline.

### 2. Monitor the Pipeline

Open the running build and select:

    Console Output

The console will display each pipeline stage and its output.

The expected stages are:

    Checkout
       ↓
    Install Dependencies
       ↓
    Build Application
       ↓
    Docker Build
       ↓
    Deploy

### 3. Verify the Build

At the end of the console output, Jenkins should show:

    Finished: SUCCESS

This confirms that the application was successfully checked out, built, containerized, and deployed by Jenkins.

### 4. Verify the Docker Container

After a successful Jenkins build, check the running container:

    docker ps

The `quick-bite` container should be running.

### 5. Test the Application

    curl http://localhost:3000

The application should return a response from the running container.

## ☸️ AWS EKS Cluster Setup

Amazon EKS (Elastic Kubernetes Service) is used to run the Quick-Bite application using Kubernetes.

### 1. Check eksctl

    eksctl version

### 2. Check kubectl

    kubectl version --client

### 3. Create the EKS Cluster

Create the cluster using `eksctl`:

    eksctl create cluster --name cluster1 --region ap-south-1 --node-type c7i-flex.large --zones ap-south-1a,ap-south-1b

This command creates:

- An EKS cluster named `cluster1`
- Two availability zones
- Managed worker nodes
- Required AWS networking resources
- Kubernetes configuration for `kubectl`

Cluster creation may take several minutes.

### 4. Verify the Cluster

Check the cluster:

    eksctl get cluster --region ap-south-1

Check the Kubernetes nodes:

    kubectl get nodes

The nodes should show:

    STATUS
    Ready

### 5. Check Kubernetes System Pods

    kubectl get pods -n kube-system

The core Kubernetes components should be running.

## 🚀 Kubernetes Deployment

Kubernetes Deployment is used to create and manage the Quick-Bite application Pods.

The Deployment uses the Docker image stored in Docker Hub.

### 1. Check the Deployment YAML

The project contains the following Kubernetes Deployment file:

    quick-bite-deployment.yaml

The Deployment creates two replicas of the application.

### 2. Apply the Deployment

Run:

    kubectl apply -f quick-bite-deployment.yaml

Expected output:

    deployment.apps/quick-bite created

### 3. Check the Deployment

    kubectl get deployments

The `quick-bite` deployment should be available.

### 4. Check the Pods

    kubectl get pods

You should see two Quick-Bite Pods.

Both Pods should eventually show:

    STATUS
    Running

### 5. Check Deployment Details

    kubectl describe deployment quick-bite

This command can be used to view the Deployment configuration, replica count, container image, and events.


## 🌐 Kubernetes Service and LoadBalancer

A Kubernetes Service is used to expose the Quick-Bite application running inside the Pods.

This project uses an AWS LoadBalancer Service to make the application accessible from the internet.

### 1. Check the Service YAML

The project contains:

    quick-bite-service.yaml

The Service uses:

    Type: LoadBalancer

It forwards traffic from port `80` to the application's container port `3000`.

### 2. Apply the Service

Run:

    kubectl apply -f quick-bite-service.yaml

Expected output:

    service/quick-bite-service created

### 3. Check the Service

    kubectl get svc

You should see:

    quick-bite-service    LoadBalancer

AWS will automatically provision an external LoadBalancer.

### 4. Get the External Address

Run:

    kubectl get svc quick-bite-service

Wait until the `EXTERNAL-IP` field contains the AWS LoadBalancer hostname.

Example:

    a08c12a16b4e5440bb1938ef735d1886-529001734.ap-south-1.elb.amazonaws.com

### 5. Access the Application

Open the LoadBalancer address in a web browser:

    http://<EXTERNAL-LOADBALANCER-DNS>

The Quick-Bite application should now be accessible from the internet.

## ✅ Final Verification

After deploying the application, verify that all components are working correctly.

### 1. Check EKS Nodes

    kubectl get nodes

All worker nodes should show:

    STATUS
    Ready

### 2. Check Kubernetes Pods

    kubectl get pods

The Quick-Bite Pods should show:

    READY
    1/1

and:

    STATUS
    Running

### 3. Check Deployment

    kubectl get deployment

The Quick-Bite Deployment should show the required replicas as available.

### 4. Check Service

    kubectl get svc

The Quick-Bite Service should show:

    TYPE
    LoadBalancer

and an AWS LoadBalancer address under `EXTERNAL-IP`.

### 5. Check Application

Open the LoadBalancer address in a web browser:

    http://<EXTERNAL-LOADBALANCER-DNS>

The Quick-Bite application should load successfully.

### 6. Verify the Complete Workflow

The final deployment flow is:

    GitHub
      ↓
    Jenkins
      ↓
    Application Build
      ↓
    Docker Image
      ↓
    Docker Hub
      ↓
    AWS EKS
      ↓
    Kubernetes Deployment
      ↓
    Kubernetes Pods
      ↓
    LoadBalancer
      ↓
    Live Quick-Bite Application

If all the above components are working, the complete DevOps deployment is successful.

---

## 🎉 Deployment Complete

If the checks above are successful, the **Quick-Bite Delivery App** has completed the full DevOps journey:

**Source Code → CI Pipeline → Container → Registry → Kubernetes → Cloud LoadBalancer → Live Application**

> ⭐ If this project helped you learn DevOps, consider starring the repository and using it as a foundation for your own CI/CD projects.

---

<p align="center">
  <strong>Built with ❤️ while learning DevOps, Docker, Kubernetes & AWS</strong>
</p>
