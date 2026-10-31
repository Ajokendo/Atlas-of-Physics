# Интеграция оригинального движка

Оригинальные интерактивные лаборатории добавлены для всех 15 глав:

1. Кинематика
2. Законы Ньютона
3. Движение по окружности
4. Работа, энергия и мощность
5. Импульс и удар
6. Колебания
7. Вращение
8. Жидкости
9. Электростатика
10. Закон Гаусса
11. Электрический потенциал
12. Конденсаторы
13. Электрические цепи
14. Магнитные поля
15. Электромагнитная индукция

Каждая лаборатория подключена к каталогу сайта и использует оригинальные модули сцены, рендеринга и управления. Учебные тексты, интерфейс, подписи и пояснения адаптируются на русский язык; физические формулы и вычислительная логика сохраняются.

Исходный проект Nathan Liow: https://github.com/nathanliow/atlas-of-physics

Сохраняются лицензия MIT и уведомления об авторстве.

## Проверки и дальнейшая работа

1. Проверка синтаксиса JavaScript для модулей движка.
2. Проверка физических инвариантов каждой главы через отдельные тесты.
3. Проверка сборки и публикации на GitHub Pages.
4. Дополнительная ручная проверка сенсорного управления, мобильной адаптации и производительности на смартфонах.

Пути лабораторий: `kinematics/`, `newton/`, `circular/`, `energy/`, `momentum/`, `oscillations/`, `rotation/`, `fluids/`, `electrostatics/`, `gauss/`, `potential/`, `capacitors/`, `circuits/`, `magnetism/`, `induction/`.

Русские главы в корне репозитория остаются основной версией сайта.

## Локальный запуск проверок

Команды выполняются из корня репозитория в Bash или Git Bash (Node.js 22):

```bash
for file in original-engine/engine/*.js original-engine/kinematics/*.js original-engine/newton/*.js original-engine/circular/*.js original-engine/energy/*.js original-engine/momentum/*.js original-engine/oscillations/*.js original-engine/rotation/*.js original-engine/fluids/*.js original-engine/electrostatics/*.js original-engine/gauss/*.js original-engine/potential/*.js original-engine/capacitors/*.js original-engine/circuits/*.js original-engine/magnetism/*.js original-engine/induction/*.js; do
  node --input-type=module --check < "$file" || exit 1
done

for test in original-engine/*/checks.mjs; do
  node "$test" || exit 1
done
```

Первый цикл проверяет синтаксис модулей движка, второй запускает физические инварианты и проверки практических заданий всех лабораторий. Если команда завершается с ненулевым кодом, перед передачей ветки необходимо устранить ошибку и повторить весь набор.

Эти проверки не заменяют браузерную проверку: отдельно следует проверить загрузку 3D-сцен, сенсорное управление, поведение при изменении размера окна и режим reduced motion на реальных мобильных устройствах. Проверка публикации GitHub Pages также остаётся отдельной контрольной точкой.
