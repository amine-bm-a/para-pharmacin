<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name'                  => 'John Doe',
            'email'                 => 'john.doe@gmail.com',
            'phone'                 => '+212600000000',
            'password'              => 'SecurePass123',
            'password_confirmation' => 'SecurePass123',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'access_token',
                     'user' => ['id', 'name', 'email', 'role']
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john.doe@gmail.com',
            'role'  => 'client'
        ]);
    }

    public function test_client_login_returns_token_immediately()
    {
        $user = User::factory()->create([
            'email'    => 'client@example.com',
            'password' => Hash::make('Password123'),
            'role'     => 'client',
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'client@example.com',
            'password' => 'Password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'access_token',
                     'user'
                 ])
                 ->assertJsonMissing(['requires_2fa' => true]);
    }

    public function test_admin_login_triggers_2fa()
    {
        $user = User::factory()->create([
            'email'    => 'admin@example.com',
            'password' => Hash::make('Password123'),
            'role'     => 'admin',
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'admin@example.com',
            'password' => 'Password123',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'success'      => true,
                     'requires_2fa' => true,
                     'email'        => 'admin@example.com'
                 ]);

        $user->refresh();
        $this->assertNotNull($user->two_factor_code);
        $this->assertNotNull($user->two_factor_expires_at);
    }

    public function test_admin_can_verify_2fa()
    {
        $user = User::factory()->create([
            'email'                 => 'admin@example.com',
            'password'              => Hash::make('Password123'),
            'role'                  => 'admin',
            'two_factor_code'       => '123456',
            'two_factor_expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->postJson('/api/verify-2fa', [
            'email' => 'admin@example.com',
            'code'  => '123456',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'access_token',
                     'user'
                 ]);

        $user->refresh();
        $this->assertNull($user->two_factor_code);
        $this->assertNull($user->two_factor_expires_at);
    }
}
