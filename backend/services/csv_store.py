import csv
import json
from pathlib import Path
from filelock import FileLock
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime

class CSVStore:
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True, parents=True)
    
    def read_csv(self, filename: str) -> List[Dict[str, Any]]:
        file_path = self.data_dir / filename
        lock_path = file_path.with_suffix(file_path.suffix + '.lock')
        
        if not file_path.exists():
            return []
        
        with FileLock(lock_path):
            try:
                with open(file_path, 'r', newline='', encoding='utf-8') as csvfile:
                    reader = csv.DictReader(csvfile)
                    return list(reader)
            except (FileNotFoundError, csv.Error):
                return []
    
    def write_csv(self, filename: str, data: List[Dict[str, Any]], fieldnames: List[str] = None):
        file_path = self.data_dir / filename
        lock_path = file_path.with_suffix(file_path.suffix + '.lock')
        
        # Ensure directory exists
        file_path.parent.mkdir(exist_ok=True, parents=True)
        
        if not data:
            return
        
        if fieldnames is None:
            fieldnames = list(data[0].keys())
        
        with FileLock(lock_path):
            with open(file_path, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
                writer.writeheader()
                writer.writerows(data)
    
    def append_csv(self, filename: str, row: Dict[str, Any]):
        existing_data = self.read_csv(filename)
        existing_data.append(row)
        self.write_csv(filename, existing_data)
    
    def update_csv_row(self, filename: str, row: Dict[str, Any], key_field: str = 'id'):
        existing_data = self.read_csv(filename)
        
        # Find existing row by key
        for i, existing_row in enumerate(existing_data):
            if existing_row.get(key_field) == row.get(key_field):
                existing_data[i] = row
                break
        else:
            # Row not found, append it
            existing_data.append(row)
        
        self.write_csv(filename, existing_data)
    
    def delete_csv_row(self, filename: str, key_value: str, key_field: str = 'id'):
        existing_data = self.read_csv(filename)
        updated_data = [row for row in existing_data if row.get(key_field) != key_value]
        self.write_csv(filename, updated_data)
    
    def find_csv_row(self, filename: str, key_value: str, key_field: str = 'id') -> Optional[Dict[str, Any]]:
        data = self.read_csv(filename)
        for row in data:
            if row.get(key_field) == key_value:
                return row
        return None
    
    def generate_id(self) -> str:
        return str(uuid.uuid4())
    
    def get_timestamp(self) -> str:
        return datetime.utcnow().isoformat()

class JSONStore:
    
    def __init__(self, data_dir: str = "."):
        self.data_dir = Path(data_dir)
    
    def get_timestamp(self) -> str:
        return datetime.utcnow().isoformat()
    
    def read_json(self, filename: str) -> Dict[str, Any]:
        file_path = self.data_dir / filename
        lock_path = file_path.with_suffix(file_path.suffix + '.lock')
        
        if not file_path.exists():
            return {}
        
        with FileLock(lock_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as jsonfile:
                    return json.load(jsonfile)
            except (FileNotFoundError, json.JSONDecodeError):
                return {}
    
    def write_json(self, filename: str, data: Dict[str, Any]):
        file_path = self.data_dir / filename
        lock_path = file_path.with_suffix(file_path.suffix + '.lock')
        
        # Ensure directory exists
        file_path.parent.mkdir(exist_ok=True, parents=True)
        
        with FileLock(lock_path):
            with open(file_path, 'w', encoding='utf-8') as jsonfile:
                json.dump(data, jsonfile, indent=2, ensure_ascii=False)