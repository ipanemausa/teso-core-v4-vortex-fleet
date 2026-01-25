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
    
    output_filename = "TESO_MASTER_DATASET_V4.xlsx"
    
    # Save buffer to file
    with open(output_filename, "wb") as f:
        f.write(excel_buffer.getvalue())
        
    print(f"✅ ÉXITO: Archivo generado: {output_filename}")
    print(f"📁 Ubicación: {os.path.abspath(output_filename)}")
    print("------------------------------------------------------------")

if __name__ == "__main__":
    main()
