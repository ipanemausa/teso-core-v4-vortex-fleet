import os
import sys

# Ensure we can import from the same directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from simulation_engine import generate_financial_simulation

def main():
    print("--- INICIANDO GENERACIÓN DE DATASET MAESTRO (360 DÍAS) ---")
    print("... Aplicando Supuestos: 10% On-Demand, Regla Liquidez, Chaos Factors ...")
    
    # Generate 360 days of data (approx 86,400 rows)
    excel_buffer, _ = generate_financial_simulation(days=360)
    
    output_filename = "TESO_MASTER_DATASET.xlsx"
    
    # Save buffer to file
    with open(output_filename, "wb") as f:
        f.write(excel_buffer.getvalue())
        
    print(f"✅ ÉXITO: Archivo generado: {output_filename}")
    print(f"📁 Ubicación: {os.path.abspath(output_filename)}")
    print("------------------------------------------------------------")

if __name__ == "__main__":
    main()
