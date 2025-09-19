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
    return session.get('role') == 'admin'

def is_authenticated():
    return 'user_id' in session

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

# @admin_bp.route('/lessons/<lesson_id>', methods=['DELETE'])
# def delete_lesson(lesson_id: str):
#     print(f'Received request to delete lesson with ID: {lesson_id}')
#     if not is_authenticated():
#         return jsonify({'message': 'Unauthorized'}), 401
    
#     if not is_admin():
#         return jsonify({'message': 'Admin access required'}), 403
    
#     # Find and remove lesson from category files
#     lesson_found = False
#     for category_id in CATEGORIES.keys():
#         csv_store.delete_csv_row(f'lessons/{category_id}.csv', lesson_id)
#         # Check if deletion was successful by trying to find the lesson
#         if csv_store.find_csv_row(f'lessons/{category_id}.csv', lesson_id) is None:
#             lesson_found = True
    
#     if lesson_found:
#         return jsonify({'message': 'Lesson deleted successfully'})
#     else:
#         return jsonify({'message': 'Lesson not found'}), 404