from flask import Blueprint, request, jsonify, session
from services.csv_store import CSVStore

progress_bp = Blueprint('progress', __name__)
csv_store = CSVStore('data')

def is_authenticated():
    return 'user_id' in session

def get_user_id():
    return session.get('user_id')

@progress_bp.route('/progress', methods=['GET'])
def get_user_progress():
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    
    user_id = get_user_id()
    progress_data = csv_store.read_csv('progress/progress.csv')
    
    # Filter progress for current user
    user_progress = [p for p in progress_data if p.get('userId') == user_id]
    
    return jsonify(user_progress)

@progress_bp.route('/progress/category/<category_id>', methods=['GET'])
def get_category_progress(category_id: str):
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    
    user_id = get_user_id()
    progress_data = csv_store.read_csv('progress/progress.csv')
    
    # Get lessons for this category to match against
    lessons = csv_store.read_csv(f'lessons/{category_id}.csv')
    lesson_ids = [lesson.get('id') for lesson in lessons]
    
    # Filter progress for current user and category
    category_progress = []
    for p in progress_data:
        if p.get('userId') == user_id and p.get('lessonId') in lesson_ids:
            category_progress.append(p)
    
    return jsonify(category_progress)

@progress_bp.route('/progress', methods=['POST'])
def update_progress():
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    
    data = request.get_json()
    lesson_id = data.get('lessonId')
    status = data.get('status', 'in_progress')  # 'completed', 'in_progress', 'not_started'
    score = data.get('score', 0)
    attempts = data.get('attempts', 1)
    
    if not lesson_id:
        return jsonify({'message': 'Lesson ID required'}), 400
    
    if status not in ['completed', 'in_progress', 'not_started']:
        return jsonify({'message': 'Invalid status'}), 400
    
    user_id = get_user_id()
    
    # Create or update progress record
    progress_record = {
        'userId': user_id,
        'lessonId': lesson_id,
        'status': status,
        'score': str(score),
        'attempts': str(attempts),
        'lastUpdated': csv_store.get_timestamp()
    }
    
    # Check if progress record already exists
    progress_data = csv_store.read_csv('progress/progress.csv')
    existing_record = None
    for i, record in enumerate(progress_data):
        if record.get('userId') == user_id and record.get('lessonId') == lesson_id:
            existing_record = i
            break
    
    if existing_record is not None:
        # Update existing record
        progress_data[existing_record] = progress_record
        csv_store.write_csv('progress/progress.csv', progress_data)
    else:
        # Create new record
        csv_store.append_csv('progress/progress.csv', progress_record)
    
    return jsonify({'message': 'Progress updated successfully', 'progress': progress_record})

@progress_bp.route('/progress/lesson/<lesson_id>', methods=['GET'])
def get_lesson_progress(lesson_id: str):
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    
    user_id = get_user_id()
    progress_data = csv_store.read_csv('progress/progress.csv')
    
    # Find progress for this lesson and user
    for record in progress_data:
        if record.get('userId') == user_id and record.get('lessonId') == lesson_id:
            return jsonify(record)
    
    # No progress found, return default
    return jsonify({
        'userId': user_id,
        'lessonId': lesson_id,
        'status': 'not_started',
        'score': '0',
        'attempts': '0',
        'lastUpdated': None
    })