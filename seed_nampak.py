"""
Псевдоним для seed_nampack.py (на случай опечатки seed_nampak.py vs seed_nampack.py).
Запуск: python seed_nampak.py
"""
import runpy

if __name__ == "__main__":
    runpy.run_module("seed_nampack", run_name="__main__")
