const express = require('express');
const router = express.Router();
const db = require('../../db.json');
const { v4: uuidv4 } = require('uuid');
/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', (req, res) => {
    const books = db.books;
    res.send(books);
});

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
router.get('/:id', (req, res) => {
    id = req.params.id;
    const book = db.books.find((book) => book.id === id);
    if (book) {
        res.json({
            status: '200',
            data: book,
        });
    } else {
        res.json({
            status: '404',
            message: 'Not Found',
        });
    }
});
/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

router.post('/', function (req, res) {
    const { title, author } = req.body;
    const newBook = {
        id: uuidv4(),
        title,
        author,
    };
    db.books.push(newBook);
    return res.status(200).json(newBook);
});
/**
 * @swagger
 * /api/v1/books/{id}:
 *  put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */

router.put('/:id', (req, res) => {
    const book = db.books.find((book) => book.id === req.params.id);
    if (book) {
        db.books = db.books.map((book) => {
            if (book.id === req.params.id) {
                book.author = req.body.author;
                book.title = req.body.title;
            }
            return book;
        });
        // return res.status(200).json({ message: 'Updated book successfully' });
        return res.status(200).json(db.books);
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

router.delete('/:id', (req, res) => {
    const book = db.books.find((book) => book.id === req.params.id);
    if (book) {
        db.books = db.books.filter((book) => book.id !== req.params.id);
        return res.status(200).json({ message: 'Book deleted successfully' });
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }
});
module.exports = router;
