from flask import Blueprint, request, jsonify, session
from services.csv_store import CSVStore

admin_bp = Blueprint('admin', __name__)
csv_store = CSVStore('data')

CATEGORIES = {
    'science': 'Science',
    'technology': 'Technology', 
    'engineering': 'Engineering',
    'mathematics': 'Mathematics'
}

def is_admin():
    print(f"Checking admin role from session: {session.get('role')}")
    return session.get('role') == 'admin'

def is_authenticated():
    print(f"Checking authentication, session: {session}")
    return 'user_id' in session

@admin_bp.route('/lessons', methods=['POST'])
def create_lesson():
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    
    if not is_admin():
        return jsonify({'message': 'Admin access required'}), 403
    
    data = request.get_json()
    title = data.get('title')
    category = data.get('category')
    content = data.get('content', '')
    summary = data.get('summary', '')
    answer_guide = data.get('answerGuide', '')
    difficulty = data.get('difficulty', 'Easy')
    estimated_minutes = data.get('estimatedMinutes', 30)
    tags = data.get('tags', [])
    
    if not title or not category:
        return jsonify({'message': 'Title and category are required'}), 400
    
    if category not in CATEGORIES:
        return jsonify({'message': 'Invalid category'}), 400
    
    # Create new lesson
    lesson_id = csv_store.generate_id()
    new_lesson = {
        'id': lesson_id,
        'title': title,
        'category': category,
        'summary': summary,
        'content': content,
        'answerGuide': answer_guide,
        'difficulty': difficulty,
        'estimatedMinutes': str(estimated_minutes),
        'tags': '|'.join(tags) if tags else '',
        'authorId': session.get('user_id'),
        'createdAt': csv_store.get_timestamp(),
        'schoolId': 'default-school'
    }
    
    # Add lesson to appropriate category CSV
    csv_filename = f'lessons/{category}.csv'
    csv_store.append_csv(csv_filename, new_lesson)
    
    return jsonify({'message': 'Lesson created successfully', 'lesson': new_lesson}), 201

@admin_bp.route('/lessons/<lesson_id>', methods=['PUT'])
def update_lesson(lesson_id: str):
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    
    if not is_admin():
        return jsonify({'message': 'Admin access required'}), 403
    
    data = request.get_json()
    
    # Find lesson in category files
    lesson_found = False
    for category_id in CATEGORIES.keys():
        lessons = csv_store.read_csv(f'lessons/{category_id}.csv')
        for i, lesson in enumerate(lessons):
            if lesson.get('id') == lesson_id:
                # Update lesson data
                lesson.update({
                    'title': data.get('title', lesson.get('title')),
                    'summary': data.get('summary', lesson.get('summary')),
                    'content': data.get('content', lesson.get('content')),
                    'answerGuide': data.get('answerGuide', lesson.get('answerGuide')),
                    'difficulty': data.get('difficulty', lesson.get('difficulty')),
                    'estimatedMinutes': str(data.get('estimatedMinutes', lesson.get('estimatedMinutes'))),
                    'tags': '|'.join(data.get('tags', [])) if data.get('tags') else lesson.get('tags', ''),
                })
                
                # Write back to CSV
                csv_store.write_csv(f'lessons/{category_id}.csv', lessons)
                lesson_found = True
                return jsonify({'message': 'Lesson updated successfully', 'lesson': lesson})
    
    if not lesson_found:
        return jsonify({'message': 'Lesson not found'}), 404

@admin_bp.route('/lessons/<lesson_id>', methods=['DELETE'])
def delete_lesson(lesson_id: str):
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    
    if not is_admin():
        return jsonify({'message': 'Admin access required'}), 403
    
    # Find and remove lesson from category files
    lesson_found = False
    for category_id in CATEGORIES.keys():
        csv_store.delete_csv_row(f'lessons/{category_id}.csv', lesson_id)
        # Check if deletion was successful by trying to find the lesson
        if csv_store.find_csv_row(f'lessons/{category_id}.csv', lesson_id) is None:
            lesson_found = True
    
    if lesson_found:
        return jsonify({'message': 'Lesson deleted successfully'})
    else:
        return jsonify({'message': 'Lesson not found'}), 404