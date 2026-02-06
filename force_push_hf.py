
import os
import subprocess
from dotenv import load_dotenv

def force_push():
    print("🚀 STARTING DIRECT PUSH TO HUGGING FACE SPACE...")
    
    # 1. Load Token
    # We are in teso_core. .env is in api/.env
    load_dotenv("api/.env")
    token = os.getenv("HF_TOKEN")
    
    if not token:
        print("❌ ERROR: HF_TOKEN not found in api/.env")
        return

    # 2. Configure Remote
    # Space URL: https://huggingface.co/spaces/GuillermoHoyos/teso
    remote_url = f"https://GuillermoHoyos:{token}@huggingface.co/spaces/GuillermoHoyos/teso"
    
    print("🔗 Configuring Remote 'hf_target'...")
    subprocess.run(["git", "remote", "remove", "hf_target"], capture_output=True)
    subprocess.run(["git", "remote", "add", "hf_target", remote_url], check=True)
    
    # 3. LFS Install (Just in case)
    subprocess.run(["git", "lfs", "install"], capture_output=True)
    
    # 4. Push
    print("📤 PUSHING CODE (v4.4)... This may take a moment.")
    try:
        # Push current branch (main) to remote main
        res = subprocess.run(["git", "push", "--force", "hf_target", "main:main"], capture_output=True, text=True)
        
        if res.returncode == 0:
            print("✅ SUCCESS: Code pushed to Hugging Face!")
            print(res.stdout)
        else:
            print("⚠️ PUSH COMPLETED WITH WARNINGS/ERRORS:")
            print(res.stderr)
            
    except Exception as e:
        print(f"❌ EXCEPTION: {e}")

if __name__ == "__main__":
    force_push()
