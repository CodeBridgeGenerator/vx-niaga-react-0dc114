<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'shippingAddress1' => 'string|max:250',
'shippingAddress2' => 'string|max:250',
'shippingAddress3' => 'string|max:250',
'shippingCity' => 'string|max:250',
'shippingState' => 'string|max:250',
'billingAddress1' => 'string|max:250',
'billingAddress2' => 'string|max:250',
'billingAddress3' => 'string|max:250',
'billingCity' => 'string|max:250',
'billingState' => 'string|max:250'
            // 'name' => 'required|string|max:250',
            // 'email' => 'required|email|max:250|unique:users',
            // 'password' => 'required|min:3|confirmed'
        ];
    }
}
