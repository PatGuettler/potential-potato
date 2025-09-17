from flask import Blueprint, request, jsonify, session
from services.csv_store import CSVStore
from typing import List, Dict, Any

lessons_bp = Blueprint('lessons', __name__)
csv_store = CSVStore('data')

# Category mapping
CATEGORIES = {
    'science': 'Science',
    'technology': 'Technology', 
    'engineering': 'Engineering',
    'mathematics': 'Mathematics'
}

def is_authenticated():
    """Check if user is authenticated"""
    return 'user_id' in session

def get_user_role():
    """Get current user's role"""
    return session.get('role', 'student')

def filter_lesson_for_role(lesson: Dict[str, Any], role: str) -> Dict[str, Any]:
    """Filter lesson content based on user role"""
    if role == 'student':
        # Students don't see answer guides
        filtered = lesson.copy()
        if 'answerGuide' in filtered:
            del filtered['answerGuide']
        return filtered
    return lesson

@lessons_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all lesson categories"""
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

@lessons_bp.route('/lessons', methods=['GET'])
def get_all_lessons():
    """Get all lessons across all categories"""
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

@lessons_bp.route('/lessons/category/<category_id>', methods=['GET'])
def get_lessons_by_category(category_id: str):
    """Get lessons for a specific category"""
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

@lessons_bp.route('/lessons/<lesson_id>', methods=['GET'])
def get_lesson_by_id(lesson_id: str):
    """Get specific lesson by ID"""
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

@lessons_bp.route('/lessons/<lesson_id>', methods=['PUT'])
def update_lesson(lesson_id: str):
    """Update an existing lesson"""
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

@lessons_bp.route('/lessons/<lesson_id>', methods=['DELETE'])
def delete_lesson(lesson_id: str):
    """Delete a lesson"""
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