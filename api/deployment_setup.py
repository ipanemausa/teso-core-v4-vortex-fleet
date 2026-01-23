import os
import sys
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("teso_deployment")

def setup_deployment_environment():
    """
    Prepares the environment for the unified HF Space deployment.
    Ensures 'static' directory exists and verifies seed data.
    """
    logger.info("🦅 TESO CLOUD: Initiating Deployment Setup")

    # 1. Define Paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    web_dist_dir = os.path.join(base_dir, "static")
    assets_dir = os.path.join(web_dist_dir, "assets")
    seed_data_dir = os.path.join(base_dir, "seed_data")

    # 2. Ensure Directories Exist
    try:
        if not os.path.exists(web_dist_dir):
            logger.info(f"Creating missing static directory: {web_dist_dir}")
            os.makedirs(web_dist_dir, exist_ok=True)
            
            # Create a placeholder index.html if one doesn't exist
            index_path = os.path.join(web_dist_dir, "index.html")
            if not os.path.exists(index_path):
                with open(index_path, "w") as f:
                    f.write("<h1>TESO SYSTEM: WAITING FOR FRONTEND BUILD...</h1>")

        if not os.path.exists(assets_dir):
            os.makedirs(assets_dir, exist_ok=True)

        if not os.path.exists(seed_data_dir):
            logger.info(f"Creating missing seed data directory: {seed_data_dir}")
            os.makedirs(seed_data_dir, exist_ok=True)
            
    except OSError as e:
        logger.error(f"Failed to create directories: {e}")
        sys.exit(1)

    # 3. Verify Seed Data
    logger.info("Deployment Environment Directories Ready.")
    
    if os.path.exists(seed_data_dir):
        # Optional debug listing controlled by env var
        if os.getenv("TESO_DEBUG", "false").lower() == "true":
             files = os.listdir(seed_data_dir)
             logger.info(f"DEBUG: Content of {seed_data_dir}: {files}")
        
        # Explicit check for the Master Dataset
        master_file = os.path.join(seed_data_dir, "TESO_MASTER_DATASET.xlsx")
        if os.path.exists(master_file):
            logger.info(f"✅ Verified critical seed data: {os.path.basename(master_file)}")
        else:
            logger.warning("⚠️ TESO_MASTER_DATASET.xlsx not found in seed_data directory.")
    else:
        logger.error("❌ Seed data directory is missing even after creation attempt.")

if __name__ == "__main__":
    setup_deployment_environment()
