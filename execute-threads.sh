#!/usr/bin/env bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

while true; do
    clear
    echo -e "${BLUE}==============================${NC}"
    echo -e "${GREEN}   NPM Start Command Menu   ${NC}"
    echo -e "${BLUE}==============================${NC}"
    echo -e "${YELLOW}1) npm start:simple-lock (SimpleLock thread simulation)${NC}"
    echo -e "${YELLOW}2) npm run start:queue-lock (QueueLock thread simulation)${NC}"
    echo -e "${YELLOW}3) npm run start:dev${NC}"
    echo -e "${YELLOW}4) npm run start:prod${NC}"
    echo -e "${YELLOW}5) Exit${NC}"
    echo -e "${BLUE}==============================${NC}"
    read -p "Choose an option [1-5]: " option

    case $option in
        1)
            echo -e "${GREEN}Running: npm start:simple-lock${NC}"
            npm run start:simple-lock
            ;;
        2)
            echo -e "${GREEN}Running: npm run start:queue-lock${NC}"
            npm run start:queue-lock
            ;;
        3)
            echo -e "${GREEN}Running: npm run start:semaphore-lock${NC}"
            npm run start:semaphore-lock
            ;;
        4)
            echo -e "${GREEN}Running: npm run start:prod${NC}"
            npm run start:prod
            ;;
        5)
            echo -e "${RED}Exiting...${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please try again.${NC}"
            sleep 1
            ;;
    esac
    echo -e "${BLUE}Press Enter to return to the menu...${NC}"
    read
done 