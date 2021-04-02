# nats-streaming-sample-app (node-nats-streaming)

### Prerequisites:
 Kubernetes (kubectle)\
 Skaffold

To start the app follow the below steps:
  - Step 1:
    - `npm install`
    - `skaffold dev`

  - Step 2. Get the name of the nats-depl pod:
    - `kubectle get pods`. It should looke similar to `nats-depl-5f86c87ffc-gwjxm`
    
    For this demo, we will be using port forwarding to communicate with the Kubernetes ClusterIP.
    
    `kubectl port-forward <name-of-nats-depl-pod> 4222:4222`
    
  - Step 3: Start the Lisener then the Publisher clients each in their own terminal window.
    - `npm run start-listener`
    - `npm run start-publisher`
 
 \
 You should see the events display in the terminal everytime an event is published.
 
 - To restart the publisher client type `rs` in the window you `npm run start-publisher`. This will cause the events to be resent.
