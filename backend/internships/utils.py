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
        
        # Современный HTML шаблон в стиле сайта
        html_message = f"""
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
                            <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; font-weight: 700;">{context['student_name']}</h3>
                            
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; vertical-align: top; width: 20px;">
                                        <div style="width: 8px; height: 8px; background: #2563eb; border-radius: 50%; margin-top: 6px;"></div>
                                    </td>
                                    <td style="padding: 8px 0; vertical-align: top;">
                                        <span style="color: #475569; font-weight: 500;">Email:</span>
                                        <span style="color: #1e293b; font-weight: 600; margin-left: 8px;">{context['student_email']}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; vertical-align: top; width: 20px;">
                                        <div style="width: 8px; height: 8px; background: #2563eb; border-radius: 50%; margin-top: 6px;"></div>
                                    </td>
                                    <td style="padding: 8px 0; vertical-align: top;">
                                        <span style="color: #475569; font-weight: 500;">Телефон:</span>
                                        <span style="color: #1e293b; font-weight: 600; margin-left: 8px;">{context['student_phone']}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; vertical-align: top; width: 20px;">
                                        <div style="width: 8px; height: 8px; background: #2563eb; border-radius: 50%; margin-top: 6px;"></div>
                                    </td>
                                    <td style="padding: 8px 0; vertical-align: top;">
                                        <span style="color: #475569; font-weight: 500;">Университет:</span>
                                        <span style="color: #1e293b; font-weight: 600; margin-left: 8px;">{context['student_university']}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; vertical-align: top; width: 20px;">
                                        <div style="width: 8px; height: 8px; background: #2563eb; border-radius: 50%; margin-top: 6px;"></div>
                                    </td>
                                    <td style="padding: 8px 0; vertical-align: top;">
                                        <span style="color: #475569; font-weight: 500;">Курс:</span>
                                        <span style="color: #1e293b; font-weight: 600; margin-left: 8px;">{context['student_course']}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; vertical-align: top; width: 20px;">
                                        <div style="width: 8px; height: 8px; background: #2563eb; border-radius: 50%; margin-top: 6px;"></div>
                                    </td>
                                    <td style="padding: 8px 0; vertical-align: top;">
                                        <span style="color: #475569; font-weight: 500;">Специализация:</span>
                                        <span style="color: #1e293b; font-weight: 600; margin-left: 8px;">{context['student_specialization']}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Детали заявки -->
                    <div style="margin-bottom: 32px;">
                        <h2 style="color: #2563eb; margin: 0 0 20px 0; font-size: 22px; font-weight: 700; display: flex; align-items: center;">
                            <span style="width: 4px; height: 24px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 2px; margin-right: 12px;"></span>
                            Детали заявки
                        </h2>
                        
                        <div style="background: rgba(255, 255, 255, 0.9); padding: 24px; border-radius: 16px; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.1); border: 1px solid rgba(255, 255, 255, 0.3);">
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 8px 0; vertical-align: top; width: 20px;">
                                        <div style="width: 8px; height: 8px; background: #059669; border-radius: 50%; margin-top: 6px;"></div>
                                    </td>
                                    <td style="padding: 8px 0; vertical-align: top;">
                                        <span style="color: #475569; font-weight: 500;">Компания:</span>
                                        <span style="color: #1e293b; font-weight: 600; margin-left: 8px;">{context['company_name']}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; vertical-align: top; width: 20px;">
                                        <div style="width: 8px; height: 8px; background: #059669; border-radius: 50%; margin-top: 6px;"></div>
                                    </td>
                                    <td style="padding: 8px 0; vertical-align: top;">
                                        <span style="color: #475569; font-weight: 500;">Позиция:</span>
                                        <span style="color: #1e293b; font-weight: 600; margin-left: 8px;">{context['internship_position']}</span>
                                    </td>
                                </tr>
                            </table>
                            
                            <div>
                                <p style="color: #475569; font-weight: 500; margin: 0 0 12px 0;">Комментарий студента:</p>
                                <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #2563eb; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);">
                                    <p style="margin: 0; color: #1e293b; font-weight: 500; line-height: 1.6;">
                                        {context['application_comment']}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Подпись -->
                    <div style="text-align: center; padding: 24px; background: rgba(255, 255, 255, 0.5); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.3);">
                        <p style="color: #64748b; font-size: 14px; font-weight: 500; margin: 0;">
                            Это письмо отправлено автоматически с платформы 
                            <span style="color: #2563eb; font-weight: 600;">практикастудентам.рф</span>
                        </p>
                    </div>
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
