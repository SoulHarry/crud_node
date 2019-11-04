const express = require('express')
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth')

router.get('/add',isLoggedIn, (req,res)=>{
    res.render('links/add');
})

router.post('/add', async (req,res)=>{
    const {title,url,description} = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links set ?',[newLink]); //Tambien se puede usar promesa o hacer un llamado callback en la función
    req.flash('success', 'Link saved successfully')
    res.redirect('/links');
})

router.post('/', async (req,res)=>{
    const links = await pool.query("SELECT * FROM links WHERE user_id = ? ", req.user.id);
    res.render(links);
})

router.get('/', async (req,res)=>{
    const links = await pool.query('SELECT * FROM links WHERE user_id = ? ', req.user.id);
    res.render('links/list',{links})
});

router.get('/delete/:id',isLoggedIn, async(req,res)=>{
    const {id} = req.params;
    pool.query("DELETE FROM links WHERE id = ?",[id]);
    req.flash('success','Link removed successfully')
    res.redirect("/links")
});

router.get('/edit/:id', isLoggedIn, async(req,res)=>{
    const {id} = req.params;
    const links = await pool.query("SELECT * FROM links WHERE id = ?", [id]);
    res.render('links/edit',{links: links[0]});
});

router.post('/edit/:id', async (req,res)=>{
    const {id} = req.params;
    const {title,url,description} = req.body;
    const editLink = {
        title,url,description
    }
    await pool.query("UPDATE links set ? WHERE id = ?", [editLink,id]);
    req.flash('success','Link updated successfully')
    res.redirect("/links")

})

module.exports = router;