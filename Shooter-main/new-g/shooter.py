import pygame

pygame.init()

screen_width = 800
screen_height = int(screen_width * 0.8)


screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption('shooter')


x = 200
y = 200

img = pygame.image.load('Shooter-main/new-g/img/player/Idle/0.png')
rect = img.get_rect()
rect.center = (x, y)

running = True

while running:

    screen.blit(img, rect)
    for event in pygame.event.get():
        #quit game
        if event.type == pygame.QUIT:
            running = False
    pygame.display.update()
pygame.quit()