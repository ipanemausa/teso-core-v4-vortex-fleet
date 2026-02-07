import os
import sys

# Ensure we can import from the same directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from simulation_engine import generate_financial_simulation

def main():
    print("--- INICIANDO GENERACIÓN DE DATASET MAESTRO V4 REDUCIDO (360 DÍAS) ---")
    print("... Aplicando Supuestos: 40 Servicios/Día, 10% On-Demand, Regla Liquidez, Chaos Factors ...")
    
    # Generate 360 days of data
    excel_buffer, _ = generate_financial_simulation(
        days=360, 
        base_daily_services=40,  # V4 Assumption
        drivers_count=15         # V4 Assumption: High Efficiency Fleet
    )
    
    # PATH CORRECTION: Save to seed_data so simulation_engine finds it
    base_dir = os.path.dirname(os.path.abspath(__file__))
    seed_dir = os.path.join(base_dir, "seed_data")
    if not os.path.exists(seed_dir):
        os.makedirs(seed_dir)
        
    output_filename = os.path.join(seed_dir, "TESO_MASTER_DATASET.xlsx")
    
    # Save buffer to file
    with open(output_filename, "wb") as f:
        f.write(excel_buffer.getvalue())
        
    print(f"[INFO] EXITO: Archivo Maestro generado: {output_filename}")
    print(f"[INFO] Ubicacion Absoluta: {os.path.abspath(output_filename)}")
    print("------------------------------------------------------------")

if __name__ == "__main__":
    main()
