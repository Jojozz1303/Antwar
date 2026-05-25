from mbuild import *
from mbuild.event import *
from cyberpi import *

# =========================
# ANT WAR
# catégorie : Guerre
# =========================

food = 100
army = 0
enemy_life = 100


# =========================
# BLOCS
# =========================

def creer_fourmi():
    global food
    global army

    if food >= 10:
        food -= 10
        army += 1


def ajouter_nourriture(amount):
    global food

    food += amount


def attaquer():
    global enemy_life

    if army > 0:

        damage = army * 2

        enemy_life -= damage

        if enemy_life < 0:
            enemy_life = 0


def reinitialiser():
    global food
    global army
    global enemy_life

    food = 100
    army = 0
    enemy_life = 100


def nourriture():
    return food


def armee():
    return army


def vie_ennemie():
    return enemy_life


# =========================
# AFFICHAGE
# =========================

def afficher():

    cyberpi.console.clear()

    cyberpi.console.println("=== ANT WAR ===")
    cyberpi.console.println("")
    cyberpi.console.println("Food : " + str(food))
    cyberpi.console.println("Army : " + str(army))
    cyberpi.console.println("Enemy : " + str(enemy_life))


# =========================
# BOUCLE
# =========================

reinitialiser()
afficher()

while True:

    # A = créer fourmi
    if cyberpi.controller.is_press("a"):

        creer_fourmi()
        afficher()

        while cyberpi.controller.is_press("a"):
            pass


    # B = attaquer
    if cyberpi.controller.is_press("b"):

        attaquer()
        afficher()

        while cyberpi.controller.is_press("b"):
            pass


    # A+B = nourriture
    if cyberpi.controller.is_press("a") and cyberpi.controller.is_press("b"):

        ajouter_nourriture(20)
        afficher()

        while cyberpi.controller.is_press("a") or cyberpi.controller.is_press("b"):
            pass


    # victoire
    if enemy_life <= 0:

        cyberpi.console.clear()
        cyberpi.console.println("VICTOIRE !")

        sleep(2)

        reinitialiser()
        afficher()


    sleep(0.1)
