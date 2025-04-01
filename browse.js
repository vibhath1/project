// JavaScript for enhanced interactivity
        document.addEventListener('DOMContentLoaded', function() {
            // Add hover effect for buttons
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                });
                btn.addEventListener('mouseleave', function() {
                    this.style.boxShadow = 'none';
                });
            });
        });