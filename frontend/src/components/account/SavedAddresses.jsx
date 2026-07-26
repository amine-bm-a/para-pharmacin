import React, { useState } from 'react';
import { 
  MapPin, 
  Edit, 
  Trash2, 
  Plus, 
  Star, 
  Phone
} from 'lucide-react';

const SavedAddresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      label: 'Home',
      isDefault: true,
      fullName: 'Sarah Johnson',
      phone: '+212 6 12 34 56 78',
      address: '123 Rue Mohammed V',
      city: 'Marrakech',
      postalCode: '40000',
      country: 'Morocco',
      instructions: 'Ring doorbell twice',
    },
    {
      id: 2,
      type: 'work',
      label: 'Office',
      isDefault: false,
      fullName: 'Sarah Johnson',
      phone: '+212 6 12 34 56 78',
      address: '456 Avenue Hassan II',
      city: 'Casablanca',
      postalCode: '20000',
      country: 'Morocco',
      instructions: 'Leave with reception',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const setDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      padding: 32,
      border: '1px solid #E8E8E8',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      marginBottom: 32,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', margin: 0, marginBottom: 4 }}>
            Saved Addresses
          </h2>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
            Manage your delivery addresses
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '12px 24px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #2E7D5B, #8FAF9B)',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 125, 91, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Plus size={18} />
          Add New Address
        </button>
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: '#F8F9FA',
          border: '2px dashed #2E7D5B',
          marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 20 }}>
            Add New Address
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                Label
              </label>
              <input
                type="text"
                placeholder="Home, Office, etc."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+212 6 XX XX XX XX"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                Street Address
              </label>
              <input
                type="text"
                placeholder="Street address, apartment, suite, etc."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                City
              </label>
              <input
                type="text"
                placeholder="City"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                Postal Code
              </label>
              <input
                type="text"
                placeholder="Postal code"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                Delivery Instructions (Optional)
              </label>
              <textarea
                placeholder="Any special instructions for delivery"
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  fontSize: 14,
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button
              style={{
                padding: '12px 24px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #2E7D5B, #8FAF9B)',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 125, 91, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Save Address
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '12px 24px',
                borderRadius: 10,
                border: '1px solid #E8E8E8',
                background: 'white',
                color: '#666',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F6F1EB';
                e.currentTarget.style.borderColor = '#2E7D5B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#E8E8E8';
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {addresses.map((address) => (
          <div
            key={address.id}
            style={{
              borderRadius: 16,
              border: address.isDefault ? '2px solid #2E7D5B' : '1px solid #E8E8E8',
              padding: 24,
              background: address.isDefault ? '#F0F9F4' : 'white',
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (!address.isDefault) {
                e.currentTarget.style.borderColor = '#2E7D5B';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (!address.isDefault) {
                e.currentTarget.style.borderColor = '#E8E8E8';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {address.isDefault && (
              <div style={{
                position: 'absolute',
                top: 16,
                right: 16,
                padding: '4px 10px',
                borderRadius: 20,
                background: '#2E7D5B',
                color: 'white',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <Star size={12} fill="white" />
                Default
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: address.isDefault ? '#2E7D5B' : '#F6F1EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <MapPin size={24} style={{ color: address.isDefault ? 'white' : '#C9A96A' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                  {address.label}
                </h3>
                <span style={{ fontSize: 12, color: '#666', textTransform: 'capitalize' }}>
                  {address.type}
                </span>
              </div>
            </div>

            <div style={{ fontSize: 14, color: '#1A1A1A', marginBottom: 8, fontWeight: 600 }}>
              {address.fullName}
            </div>

            <div style={{ fontSize: 13, color: '#666', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Phone size={14} />
              {address.phone}
            </div>

            <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
              {address.address}
            </div>

            <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
              {address.city}, {address.postalCode}
            </div>

            <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
              {address.country}
            </div>

            {address.instructions && (
              <div style={{
                padding: 10,
                borderRadius: 8,
                background: 'rgba(0, 0, 0, 0.03)',
                fontSize: 12,
                color: '#666',
                marginBottom: 16,
                fontStyle: 'italic',
              }}>
                <strong>Note:</strong> {address.instructions}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #E8E8E8', paddingTop: 16 }}>
              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address.id)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 8,
                    border: '1px solid #E8E8E8',
                    background: 'white',
                    color: '#666',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F0F9F4';
                    e.currentTarget.style.borderColor = '#2E7D5B';
                    e.currentTarget.style.color = '#2E7D5B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#E8E8E8';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  <Star size={14} />
                  Set Default
                </button>
              )}
              
              <button style={{
                flex: 1,
                padding: '10px',
                borderRadius: 8,
                border: '1px solid #E8E8E8',
                background: 'white',
                color: '#666',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F6F1EB';
                e.currentTarget.style.borderColor = '#2E7D5B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#E8E8E8';
              }}
              >
                <Edit size={14} />
                Edit
              </button>

              <button
                onClick={() => deleteAddress(address.id)}
                style={{
                  padding: '10px',
                  borderRadius: 8,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  color: '#DC2626',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FEF2F2';
                  e.currentTarget.style.borderColor = '#DC2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#E8E8E8';
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedAddresses;
