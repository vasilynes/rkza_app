def is_valid_inn(inn: str) -> bool:
    if not inn.isdigit():
        return False
    
    if len(inn) == 10:  # Юрлицо
        coefficients = [2, 4, 10, 3, 5, 9, 4, 6, 8]
        n = sum(int(inn[i]) * coefficients[i] for i in range(9))
        check = n % 11
        if check > 9:
            check = 0
        return check == int(inn[9])
        
    elif len(inn) == 12:  # ИП
        coefficients_1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
        n1 = sum(int(inn[i]) * coefficients_1[i] for i in range(10))
        check1 = n1 % 11
        if check1 > 9:
            check1 = 0
            
        coefficients_2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
        n2 = sum(int(inn[i]) * coefficients_2[i] for i in range(11))
        check2 = n2 % 11
        if check2 > 9:
            check2 = 0
            
        return check1 == int(inn[10]) and check2 == int(inn[11])
    
    return False