from flask import Blueprint, request, jsonify, session
from services.csv_store import CSVStore
from typing import List, Dict, Any

lessons_bp = Blueprint('lessons', __name__)
csv_store = CSVStore('data')

######################
# Lesson categories
######################
CATEGORIES = {
    'science': 'Science',
    'technology': 'Technology', 
    'engineering': 'Engineering',
    'mathematics': 'Mathematics'
}

def is_authenticated():
    return 'user_id' in session

def get_user_role():
    return session.get('role', 'student')

def filter_lesson_for_role(lesson: Dict[str, Any], role: str) -> Dict[str, Any]:
    if role == 'student':
        # Students don't see answer guides
        filtered = lesson.copy()
        if 'answerGuide' in filtered:
            del filtered['answerGuide']
        return filtered
    return lesson

######################
# New endpoint to create a lesson
######################
# @lessons_bp.route('/lessons', methods=['POST'])
# def create_lesson():
#     print('Received request to create a new lesson in admin.py')
#     if not is_authenticated():
#         return jsonify({'message': 'Unauthorized'}), 401
    
#     if not is_admin():
#         return jsonify({'message': 'Admin access required'}), 403
    
#     data = request.get_json()
#     title = data.get('title')
#     category = data.get('category')
#     content = data.get('content', '')
#     summary = data.get('summary', '')
#     answer_guide = data.get('answerGuide', '')
#     difficulty = data.get('difficulty', 'Easy')
#     estimated_minutes = data.get('estimatedMinutes', 30)
#     tags = data.get('tags', [])
    
#     if not title or not category:
#         return jsonify({'message': 'Title and category are required'}), 400
    
#     if category not in CATEGORIES:
#         return jsonify({'message': 'Invalid category'}), 400
    
#     # Create new lesson
#     lesson_id = csv_store.generate_id()
#     new_lesson = {
#         'id': lesson_id,
#         'title': title,
#         'category': category,
#         'summary': summary,
#         'content': content,
#         'answerGuide': answer_guide,
#         'difficulty': difficulty,
#         'estimatedMinutes': str(estimated_minutes),
#         'tags': '|'.join(tags) if tags else '',
#         'authorId': session.get('user_id'),
#         'createdAt': csv_store.get_timestamp(),
#         'schoolId': 'default-school'
#     }
    
#     # Add lesson to appropriate category CSV
#     csv_filename = f'lessons/{category}.csv'
#     csv_store.append_csv(csv_filename, new_lesson)
    
#     return jsonify({'message': 'Lesson created successfully in admin.py', 'lesson': new_lesson}), 201

######################
# New endpoint to get all lesson categories
######################
@lessons_bp.route('/categories', methods=['GET'])
def get_categories():
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    
    categories = []
    for category_id, category_name in CATEGORIES.items():
        # Count lessons in this category
        lessons = csv_store.read_csv(f'lessons/{category_id}.csv')
        categories.append({
            'id': category_id,
            'name': category_name,
            'lessonCount': len(lessons)
        })
    
    return jsonify(categories)

######################
# New endpoint to get all lessons
######################
@lessons_bp.route('/lessons', methods=['GET'])
def get_all_lessons():
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    
    user_role = get_user_role()
    all_lessons = []
    
    for category_id in CATEGORIES.keys():
        lessons = csv_store.read_csv(f'lessons/{category_id}.csv')
        for lesson in lessons:
            lesson['category'] = category_id
            filtered_lesson = filter_lesson_for_role(lesson, user_role)
            all_lessons.append(filtered_lesson)
    
    return jsonify(all_lessons)

######################
# New endpoint to get all lessons in a category
######################
@lessons_bp.route('/lessons/category/<category_id>', methods=['GET'])
def get_lessons_by_category(category_id: str):
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    
    if category_id not in CATEGORIES:
        return jsonify({'message': 'Invalid category'}), 404
    
    user_role = get_user_role()
    lessons = csv_store.read_csv(f'lessons/{category_id}.csv')
    
    # Filter lessons based on user role
    filtered_lessons = []
    for lesson in lessons:
        lesson['category'] = category_id
        filtered_lesson = filter_lesson_for_role(lesson, user_role)
        filtered_lessons.append(filtered_lesson)
    
    return jsonify(filtered_lessons)

######################
# New endpoint to get a lesson
######################
@lessons_bp.route('/lessons/<lesson_id>', methods=['GET'])
def get_lesson_by_id(lesson_id: str):
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    
    user_role = get_user_role()
    
    # Search through all category files for the lesson
    for category_id in CATEGORIES.keys():
        lessons = csv_store.read_csv(f'lessons/{category_id}.csv')
        for lesson in lessons:
            if lesson.get('id') == lesson_id:
                lesson['category'] = category_id
                filtered_lesson = filter_lesson_for_role(lesson, user_role)
                return jsonify(filtered_lesson)
    
    return jsonify({'message': 'Lesson not found'}), 404

######################
# New endpoint to update a lesson
######################
@lessons_bp.route('/lessons/<lesson_id>', methods=['PUT'])
def update_lesson(lesson_id: str):
    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    if get_user_role() not in ['teacher', 'admin']:
        return jsonify({'message': 'Forbidden'}), 403

    data = request.get_json()
    updated = False

    for category_id in CATEGORIES.keys():
        lessons = csv_store.read_csv(f'lessons/{category_id}.csv')
        for idx, lesson in enumerate(lessons):
            if lesson.get('id') == lesson_id:
                lessons[idx] = {**lesson, **data}
                csv_store.write_csv(f'lessons/{category_id}.csv', lessons)
                updated = True
                break
        if updated:
            break

    if not updated:
        return jsonify({'message': 'Lesson not found'}), 404

    return jsonify({'message': 'Lesson updated'})

######################
# New endpoint to delete a lesson
######################
@lessons_bp.route('/lessons/<lesson_id>', methods=['DELETE'])
def delete_lesson(lesson_id: str):
    print(f"Received request to delete lesson with ID: {lesson_id}")

    if not is_authenticated():
        return jsonify({'message': 'Unauthorized'}), 401
    if get_user_role() not in ['teacher', 'admin']:
        return jsonify({'message': 'Forbidden'}), 403

    deleted = False

    for category_id in CATEGORIES.keys():
        lessons = csv_store.read_csv(f'lessons/{category_id}.csv')
        new_lessons = [lesson for lesson in lessons if lesson.get('id') != lesson_id]
        if len(new_lessons) < len(lessons):
            csv_store.write_csv(f'lessons/{category_id}.csv', new_lessons)
            deleted = True
            break

    if not deleted:
        return jsonify({'message': 'Lesson not found'}), 404

    return jsonify({'message': 'Lesson deleted'})