# HPC Model Integration Setup

This guide details how to set up and run the backend image generation model hosted on the PakHPC cluster.

## Prerequisites

- Access to **PakHPC** (`https://hpc.pakhpc.com/`)
- SSH access enabled for your user

## 1. Connect to HPC

To access the cluster, use your credentials:

```bash
ssh hpcusername@hpc.pakhpc.com
```

## 2. Start the Model API

Once logged in, navigate to your project directory (if applicable) and activate the environment:

```bash
# Activate the environment
source sd3env/bin/activate

# Submit the SLURM job to start the API
sbatch api.slurm
```

> **Note:** Ensure `api.slurm` is configured to run the FastAPI server on port `7860`.

## 3. Create SSH Tunnel

To make the HPC model accessible to your local Ad-Genie backend (running on `localhost`), you need to create an SSH tunnel. This forwards your local port `7860` to the HPC's port `7860`.

Run this command in a **new local terminal**:

```bash
ssh -N -L 7860:localhost:7860 muzammil@hpc.pakhpc.com
```

- `-N`: Do not execute a remote command (just forward ports).
- `-L 7860:localhost:7860`: Forward local port 7860 to remote localhost:7860.

## 4. Verify Connection

1.  Ensure the tunnel is running.
2.  Start your local Ad-Genie backend (`npm start` or `npm run dev`).
3.  The backend will now be able to send requests to `http://127.0.0.1:7860/generate`, which are securely tunneled to the HPC cluster.

## Troubleshooting

-   **Connection Refused**: Check if the `api.slurm` job is actually running on the HPC (`squeue -u <username>`).
-   **Tunnel Fails**: Ensure port `7860` isn't already in use on your local machine.
