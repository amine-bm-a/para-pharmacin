<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogArticle extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'content',
        'image_url',
        'read_time',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'read_time' => 'integer',
    ];
}
