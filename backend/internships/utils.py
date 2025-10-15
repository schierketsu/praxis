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
        }
        
        # Создаем HTML шаблон письма
        subject = f"Заявка на практику - {internship.position}"
        
        # Простой HTML шаблон
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Новая заявка на практику</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Новая заявка на практику</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Платформа практикастудентам.рф</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #667eea; margin-top: 0;">Информация о студенте</h2>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin-top: 0; color: #333;">{context['student_name']}</h3>
                    <p><strong>Email:</strong> {context['student_email']}</p>
                    <p><strong>Телефон:</strong> {context['student_phone']}</p>
                    <p><strong>Учебное заведение:</strong> {context['student_university']}</p>
                    <p><strong>Курс:</strong> {context['student_course']}</p>
                    <p><strong>Специализация:</strong> {context['student_specialization']}</p>
                </div>
                
                <h2 style="color: #667eea;">Детали заявки</h2>
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <p><strong>Компания:</strong> {context['company_name']}</p>
                    <p><strong>Позиция:</strong> {context['internship_position']}</p>
                    <p><strong>Комментарий студента:</strong></p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                        {context['application_comment']}
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666; font-size: 14px;">
                        Это письмо отправлено автоматически с платформы практикастудентам.рф
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Отправляем email
        send_mail(
            subject=subject,
            message=f"Новая заявка от {context['student_name']} на позицию {context['internship_position']}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[company.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Email уведомление отправлено компании {company.name} о заявке от {context['student_name']}")
        return True
        
    except Exception as e:
        logger.error(f"Ошибка отправки email уведомления: {str(e)}")
        return False
