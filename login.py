import pygame
import sys

# Initialize Pygame
pygame.init()

# Screen settings
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("成语勇士传奇 - 登录界面")

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GOLD = (255, 215, 0)
DARK_GOLD = (184, 134, 11)
RED = (178, 34, 34)
DARK_RED = (139, 0, 0)
GRAY = (100, 100, 100)
LIGHT_GRAY = (200, 200, 200)

# Fonts
title_font = pygame.font.Font(None, 72)
button_font = pygame.font.Font(None, 48)
input_font = pygame.font.Font(None, 36)

# Button class
class Button:
    def __init__(self, x, y, width, height, text, color, hover_color):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = text
        self.color = color
        self.hover_color = hover_color
        self.is_hovered = False
    
    def draw(self, surface):
        mouse_pos = pygame.mouse.get_pos()
        self.is_hovered = self.rect.collidepoint(mouse_pos)
        
        color = self.hover_color if self.is_hovered else self.color
        pygame.draw.rect(surface, color, self.rect, border_radius=10)
        pygame.draw.rect(surface, GOLD, self.rect, 3, border_radius=10)
        
        text_surface = button_font.render(self.text, True, WHITE)
        text_rect = text_surface.get_rect(center=self.rect.center)
        surface.blit(text_surface, text_rect)
    
    def is_clicked(self, event):
        if event.type == pygame.MOUSEBUTTONDOWN:
            if self.rect.collidepoint(event.pos):
                return True
        return False

# Input box class
class InputBox:
    def __init__(self, x, y, width, height, placeholder):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = ""
        self.placeholder = placeholder
        self.active = False
    
    def handle_event(self, event):
        if event.type == pygame.MOUSEBUTTONDOWN:
            self.active = self.rect.collidepoint(event.pos)
        if event.type == pygame.KEYDOWN and self.active:
            if event.key == pygame.K_BACKSPACE:
                self.text = self.text[:-1]
            elif len(self.text) < 16:
                self.text += event.unicode
    
    def draw(self, surface):
        color = GOLD if self.active else WHITE
        pygame.draw.rect(surface, BLACK, self.rect, border_radius=5)
        pygame.draw.rect(surface, color, self.rect, 2, border_radius=5)
        
        if self.text:
            text_surface = input_font.render(self.text, True, WHITE)
        else:
            text_surface = input_font.render(self.placeholder, True, GRAY)
        
        text_rect = text_surface.get_rect(midleft=(self.rect.x + 10, self.rect.centery))
        surface.blit(text_surface, text_rect)

# Main game loop
def main():
    clock = pygame.time.Clock()
    
    # Create buttons
    login_btn = Button(300, 400, 200, 50, "开始游戏", DARK_GOLD, GOLD)
    register_btn = Button(300, 470, 200, 50, DARK_RED, RED)
    
    # Create input boxes
    username_box = InputBox(250, 250, 300, 50, "请输入用户名")
    password_box = InputBox(250, 350, 300, 50, "请输入密码")
    
    running = True
    while running:
        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            
            username_box.handle_event(event)
            password_box.handle_event(event)
            
            if login_btn.is_clicked(event):
                print(f"登录: {username_box.text}")
                # Here you would add login logic
            if register_btn.is_clicked(event):
                print(f"注册: {username_box.text}")
                # Here you would add registration logic
        
        # Drawing
        screen.fill(BLACK)
        
        # Draw background pattern (simple Chinese-style)
        for i in range(0, SCREEN_WIDTH, 50):
            pygame.draw.circle(screen, (20, 20, 20), (i, 30), 2)
            pygame.draw.circle(screen, (20, 20, 20), (i, SCREEN_HEIGHT - 30), 2)
        
        # Draw title
        title_text = title_font.render("成语勇士传奇", True, GOLD)
        title_rect = title_text.get_rect(center=(SCREEN_WIDTH // 2, 100))
        
        # Draw title shadow
        shadow_text = title_font.render("成语勇士传奇", True, DARK_RED)
        shadow_rect = shadow_text.get_rect(center=(SCREEN_WIDTH // 2 + 3, 103))
        screen.blit(shadow_text, shadow_rect)
        screen.blit(title_text, title_rect)
        
        # Draw subtitle
        subtitle_text = input_font.render("Idiom Warrior Legend", True, GRAY)
        subtitle_rect = subtitle_text.get_rect(center=(SCREEN_WIDTH // 2, 150))
        screen.blit(subtitle_text, subtitle_rect)
        
        # Draw input boxes
        username_box.draw(screen)
        password_box.draw(screen)
        
        # Draw buttons
        login_btn.draw(screen)
        register_btn.draw(screen)
        
        # Draw version
        version_text = input_font.render("v1.0.0", True, GRAY)
        screen.blit(version_text, (10, SCREEN_HEIGHT - 30))
        
        pygame.display.flip()
        clock.tick(60)
    
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
