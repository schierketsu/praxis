// JavaScript для улучшения функциональности резюме в админке Django
(function($) {
    'use strict';
    
    $(document).ready(function() {
        // Улучшаем функциональность удаления резюме
        $('.delete-resume-btn').on('click', function(e) {
            e.preventDefault();
            
            if (confirm('Вы уверены, что хотите удалить резюме? Это действие нельзя отменить.')) {
                // Очищаем поле резюме
                $('#id_resume').val('');
                
                // Обновляем отображение
                var resumeDisplay = $(this).closest('.resume-display');
                if (resumeDisplay.length) {
                    resumeDisplay.html(
                        '<div style="padding: 15px; background: #fff2f0; border: 1px solid #ffccc7; border-radius: 6px; margin-bottom: 10px;">' +
                        '<div style="display: flex; align-items: center;">' +
                        '<span style="font-size: 20px; margin-right: 8px;">⚠️</span>' +
                        '<span style="color: #ff4d4f; font-weight: 500;">Резюме будет удалено при сохранении</span>' +
                        '</div>' +
                        '</div>'
                    );
                }
                
                // Показываем уведомление
                var notification = $('<div class="messagelist">' +
                    '<div class="success">Резюме будет удалено при сохранении формы</div>' +
                    '</div>');
                
                $('.messagelist').remove();
                $('form').before(notification);
                
                // Автоматически скрываем уведомление через 3 секунды
                setTimeout(function() {
                    notification.fadeOut();
                }, 3000);
            }
        });
        
        // Улучшаем отображение поля резюме
        $('#id_resume').on('change', function() {
            var file = this.files[0];
            if (file) {
                var fileInfo = $('<div class="file-info" style="margin-top: 10px; padding: 10px; background: #f0f9ff; border: 1px solid #e6f7ff; border-radius: 4px;">' +
                    '<strong>Новый файл:</strong> ' + file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)' +
                    '</div>');
                
                $('.file-info').remove();
                $(this).after(fileInfo);
            }
        });
        
        // Добавляем подсказки для поля резюме
        if ($('#id_resume').length) {
            var helpText = $('<div class="help" style="margin-top: 5px; color: #666; font-size: 12px;">' +
                'Поддерживаемые форматы: PDF, DOC, DOCX. Максимальный размер: 5MB.' +
                '</div>');
            $('#id_resume').after(helpText);
        }
    });
})(django.jQuery);
