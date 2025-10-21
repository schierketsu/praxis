from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_application_notification_email(application):
    """
    Отправляет email уведомление компании о новой заявке на практику
    """
    try:
        # Получаем данные заявки
        student = application.student
        internship = application.internship
        company = internship.company
        
        # Проверяем, есть ли email у компании
        if not company.email:
            logger.warning(f"У компании {company.name} не указан email для уведомлений")
            return False
        
        # Получаем дополнительную информацию о студенте
        student_bio = getattr(student, 'bio', '') or ''
        student_skills = getattr(student, 'skills', []) or []
        student_interests = getattr(student, 'interests', []) or []
        from django.conf import settings
        
        student_resume = getattr(student, 'resume', None)
        if student_resume:
            # Получаем полный URL для резюме
            student_resume_url = f"{settings.MEDIA_URL}{student_resume.name}"
        else:
            student_resume_url = ''
            
        
        # Подготавливаем данные для шаблона
        context = {
            'student_name': f"{student.user.first_name} {student.user.last_name}",
            'student_email': student.user.email,
            'company_name': company.name,
            'internship_position': internship.position,
            'application_comment': application.comment,
            'student_phone': student.phone or 'Не указан',
            'student_university': student.university.name if student.university else 'Не указан',
            'student_course': f"{student.course} курс" if student.course else 'Не указан',
            'student_specialization': student.specialization or 'Не указана',
            'student_bio': student_bio,
            'student_skills': student_skills,
            'student_interests': student_interests,
            'student_resume_url': student_resume_url,
        }
        
        # Создаем HTML шаблон письма
        subject = f"Заявка на практику - {internship.position}"
        
        # Извлекаем переменные из контекста для удобства
        student_name = context['student_name']
        student_email = context['student_email']
        student_phone = context['student_phone']
        student_course = context['student_course']
        student_specialization = context['student_specialization']
        student_university = context['student_university']
        student_bio = context['student_bio']
        student_skills = context['student_skills']
        student_interests = context['student_interests']
        student_resume_url = context['student_resume_url']
        company_name = context['company_name']
        internship_position = context['internship_position']
        application_comment = context['application_comment']
        
        # Создаем условные секции
        skills_section = ''
        if student_skills:
            skills_html = ''.join([f'<span style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">{skill}</span>' for skill in student_skills[:10]])
            skills_section = f'''
                            <div style="margin-top: 20px;">
                                <div style="color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Навыки</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    {skills_html}
                                </div>
                            </div>'''
        
        interests_section = ''
        if student_interests:
            interests_html = ''.join([f'<span style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">{interest}</span>' for interest in student_interests[:8]])
            interests_section = f'''
                            <div style="margin-top: 20px;">
                                <div style="color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Интересы</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    {interests_html}
                                </div>
                            </div>'''
        
        bio_section = ''
        if student_bio:
            bio_section = f'''
                            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 20px;">
                                <div style="color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">О себе</div>
                                <div style="color: #1e293b; line-height: 1.6; white-space: pre-wrap;">{student_bio}</div>
                            </div>'''
        
        resume_section = ''
        if student_resume_url:
            resume_section = f'''
                            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 16px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.2); margin-top: 20px;">
                                <div style="color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Резюме</div>
                                <a href="{student_resume_url}" style="color: #059669; text-decoration: none; font-weight: 600; font-size: 14px;" target="_blank">📄 Скачать резюме</a>
                            </div>'''
        
        # Современный HTML шаблон в стиле сайта
        html_message = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Новая заявка на практику</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            </style>
        </head>
        <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #1e293b; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); margin: 0; padding: 20px; min-height: 100vh;">
            <div style="max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 20px; box-shadow: 0 8px 32px rgba(37, 99, 235, 0.15); overflow: hidden;">
                
                <!-- Заголовок с градиентом -->
                <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 40px 30px; text-align: center; position: relative;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(29, 78, 216, 0.9) 100%);"></div>
                    <div style="position: relative; z-index: 2;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); letter-spacing: -0.3px;">
                            Новая заявка на практику
                        </h1>
                        <p style="margin: 12px 0 0 0; opacity: 0.9; font-size: 16px; font-weight: 500;">
                            практикастудентам.рф
                        </p>
                    </div>
                </div>
                
                <!-- Основной контент -->
                <div style="padding: 40px 30px; background: rgba(255, 255, 255, 0.6);">
                    
                    <!-- Информация о студенте -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="color: #2563eb; margin: 0 0 20px 0; font-size: 22px; font-weight: 700; display: flex; align-items: center;">
                            <span style="width: 4px; height: 24px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 2px; margin-right: 12px;"></span>
                            Информация о студенте
                        </h2>
                        
                        <div style="background: rgba(255, 255, 255, 0.9); padding: 24px; border-radius: 16px; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.1); border: 1px solid rgba(255, 255, 255, 0.3);">
                            <div style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid rgba(37, 99, 235, 0.1);">
                                <h3 style="margin: 0 0 4px 0; color: #1e293b; font-size: 20px; font-weight: 700;">{student_name}</h3>
                                <p style="margin: 0; color: #64748b; font-size: 14px;">{student_university}</p>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
                                <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);">
                                    <div style="color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Email</div>
                                    <div style="color: #1e293b; font-size: 14px; font-weight: 500;">{student_email}</div>
                                </div>
                                <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);">
                                    <div style="color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Телефон</div>
                                    <div style="color: #1e293b; font-size: 14px; font-weight: 500;">{student_phone}</div>
                                </div>
                                <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);">
                                    <div style="color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Курс</div>
                                    <div style="color: #1e293b; font-size: 14px; font-weight: 500;">{student_course}</div>
                                </div>
                                <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);">
                                    <div style="color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Специализация</div>
                                    <div style="color: #1e293b; font-size: 14px; font-weight: 500;">{student_specialization}</div>
                                </div>
                            </div>
                            
                            {skills_section}
                            
                            {interests_section}
                            
                            {bio_section}
                            
                            {resume_section}
                        </div>
                    </div>
                    
                    <!-- Детали заявки -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="color: #2563eb; margin: 0 0 20px 0; font-size: 22px; font-weight: 700; display: flex; align-items: center;">
                            <span style="width: 4px; height: 24px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 2px; margin-right: 12px;"></span>
                            Детали заявки
                        </h2>
                        
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 24px; border-radius: 16px; box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.2);">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 20px;">
                                <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid rgba(14, 165, 233, 0.1); box-shadow: 0 2px 4px rgba(14, 165, 233, 0.05);">
                                    <div style="color: #0c4a6e; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Компания</div>
                                    <div style="color: #1e293b; font-size: 16px; font-weight: 600;">{company_name}</div>
                                </div>
                                <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid rgba(14, 165, 233, 0.1); box-shadow: 0 2px 4px rgba(14, 165, 233, 0.05);">
                                    <div style="color: #0c4a6e; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Позиция</div>
                                    <div style="color: #1e293b; font-size: 16px; font-weight: 600;">{internship_position}</div>
                                </div>
                            </div>
                            
                            <div>
                                <div style="color: #0c4a6e; font-weight: 600; font-size: 14px; margin-bottom: 8px;">Сопроводительное письмо</div>
                                <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 2px solid #2563eb;">
                                    <p style="margin: 0; color: #1e293b; line-height: 1.5; font-size: 14px;">
                                        {application_comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Подпись -->
                    <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 12px;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);">
                                🎓
                            </div>
                            <div>
                                <div style="color: #1e293b; font-size: 16px; font-weight: 600; margin-bottom: 4px;">практикастудентам.рф</div>
                                <div style="color: #64748b; font-size: 12px; font-weight: 500;">Платформа для поиска практик</div>
                            </div>
                        </div>
                        <p style="color: #64748b; font-size: 14px; font-weight: 500; margin: 0; line-height: 1.5;">
                            Это письмо отправлено автоматически. Не отвечайте на него.<br>
                            Для связи с платформой используйте контактную информацию на сайте.
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """.format(
            student_name=student_name,
            student_email=student_email,
            student_phone=student_phone,
            student_course=student_course,
            student_specialization=student_specialization,
            student_university=student_university,
            student_bio=student_bio,
            student_skills=student_skills,
            student_interests=student_interests,
            student_resume_url=student_resume_url,
            company_name=company_name,
            internship_position=internship_position,
            application_comment=application_comment,
            skills_section=skills_section,
            interests_section=interests_section,
            bio_section=bio_section,
            resume_section=resume_section
        )
        
        # Отправляем email
        send_mail(
            subject=subject,
            message=f"Новая заявка от {student_name} на позицию {internship_position}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[company.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Email уведомление отправлено компании {company.name} о заявке от {student_name}")
        return True
        
    except Exception as e:
        logger.error(f"Ошибка отправки email уведомления: {str(e)}")
        return False
