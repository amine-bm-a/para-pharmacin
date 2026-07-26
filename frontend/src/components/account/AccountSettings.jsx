import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Globe, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const AccountSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');

  const sections = [
    { id: 'personal', title: 'Personal Information', icon: User },
    { id: 'security', title: 'Security', icon: Lock },
    { id: 'communication', title: 'Communication', icon: Bell },
    { id: 'privacy', title: 'Privacy', icon: Shield },
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      padding: 32,
      border: '1px solid #E8E8E8',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      marginBottom: 32,
    }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', margin: 0, marginBottom: 4 }}>
          Account Settings
        </h2>
        <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
          Manage your account preferences and security
        </p>
      </div>

      {/* Settings Navigation */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: '12px 20px',
                borderRadius: 10,
                border: isActive ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
                background: isActive ? '#2E7D5B' : 'white',
                color: isActive ? 'white' : '#666',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#F6F1EB';
                  e.currentTarget.style.borderColor = '#2E7D5B';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#E8E8E8';
                }
              }}
            >
              <Icon size={18} />
              {section.title}
            </button>
          );
        })}
      </div>

      {/* Personal Information */}
      {activeSection === 'personal' && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: '#F8F9FA',
          border: '1px solid #E8E8E8',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>
            Personal Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                First Name
              </label>
              <input
                type="text"
                defaultValue="Sarah"
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
                Last Name
              </label>
              <input
                type="text"
                defaultValue="Johnson"
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
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail 
                  size={18} 
                  style={{ 
                    position: 'absolute', 
                    left: 14, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#999'
                  }} 
                />
                <input
                  type="email"
                  defaultValue="sarah.johnson@email.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: 10,
                    border: '1px solid #E8E8E8',
                    background: 'white',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone 
                  size={18} 
                  style={{ 
                    position: 'absolute', 
                    left: 14, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#999'
                  }} 
                />
                <input
                  type="tel"
                  defaultValue="+212 6 12 34 56 78"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: 10,
                    border: '1px solid #E8E8E8',
                    background: 'white',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                Date of Birth
              </label>
              <input
                type="date"
                defaultValue="1990-05-15"
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
          </div>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #E8E8E8' }}>
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
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Security */}
      {activeSection === 'security' && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: '#F8F9FA',
          border: '1px solid #E8E8E8',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>
            Security Settings
          </h3>

          <div style={{ marginBottom: 32 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 16 }}>
              Change Password
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                  Current Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 16px',
                      borderRadius: 10,
                      border: '1px solid #E8E8E8',
                      background: 'white',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                    }}
                  >
                    {showPassword ? <EyeOff size={18} style={{ color: '#999' }} /> : <Eye size={18} style={{ color: '#999' }} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 16px',
                      borderRadius: 10,
                      border: '1px solid #E8E8E8',
                      background: 'white',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                    }}
                  >
                    {showNewPassword ? <EyeOff size={18} style={{ color: '#999' }} /> : <Eye size={18} style={{ color: '#999' }} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
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
            </div>

            <div style={{ marginTop: 20 }}>
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
                <Save size={18} />
                Update Password
              </button>
            </div>
          </div>

          <div style={{
            padding: 16,
            borderRadius: 12,
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <AlertTriangle size={20} style={{ color: '#DC2626' }} />
            <div style={{ fontSize: 13, color: '#DC2626', flex: 1 }}>
              <strong>Security Tip:</strong> Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.
            </div>
          </div>
        </div>
      )}

      {/* Communication */}
      {activeSection === 'communication' && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: '#F8F9FA',
          border: '1px solid #E8E8E8',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>
            Communication Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              padding: 16,
              borderRadius: 12,
              background: 'white',
              border: '1px solid #E8E8E8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#2E7D5B20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Mail size={20} style={{ color: '#2E7D5B' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px 0' }}>
                    Email Notifications
                  </h4>
                  <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                    Receive order updates, promotions, and health tips via email
                  </p>
                </div>
              </div>
              <div style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                background: '#2E7D5B',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}>
                <div style={{
                  position: 'absolute',
                  right: 4,
                  top: 4,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'all 0.2s ease',
                }} />
              </div>
            </div>

            <div style={{
              padding: 16,
              borderRadius: 12,
              background: 'white',
              border: '1px solid #E8E8E8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#C9A96A20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Phone size={20} style={{ color: '#C9A96A' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px 0' }}>
                    SMS Notifications
                  </h4>
                  <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                    Receive order status updates via SMS
                  </p>
                </div>
              </div>
              <div style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                background: '#E8E8E8',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}>
                <div style={{
                  position: 'absolute',
                  left: 4,
                  top: 4,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'all 0.2s ease',
                }} />
              </div>
            </div>

            <div style={{
              padding: 16,
              borderRadius: 12,
              background: 'white',
              border: '1px solid #E8E8E8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#8FAF9B20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Bell size={20} style={{ color: '#8FAF9B' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px 0' }}>
                    Push Notifications
                  </h4>
                  <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                    Receive real-time notifications in your browser
                  </p>
                </div>
              </div>
              <div style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                background: '#2E7D5B',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}>
                <div style={{
                  position: 'absolute',
                  right: 4,
                  top: 4,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'all 0.2s ease',
                }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #E8E8E8' }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                Preferred Language
              </label>
              <select
                defaultValue="fr"
                style={{
                  width: '100%',
                  maxWidth: 300,
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  fontSize: 14,
                  outline: 'none',
                }}
              >
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Privacy */}
      {activeSection === 'privacy' && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: '#F8F9FA',
          border: '1px solid #E8E8E8',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>
            Privacy Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              padding: 16,
              borderRadius: 12,
              background: 'white',
              border: '1px solid #E8E8E8',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#2E7D5B20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Shield size={20} style={{ color: '#2E7D5B' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px 0' }}>
                    Data Sharing
                  </h4>
                  <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                    Control how your data is shared with partners
                  </p>
                </div>
              </div>
              <select
                defaultValue="standard"
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  fontSize: 13,
                  outline: 'none',
                }}
              >
                <option value="minimal">Minimal - Only essential data</option>
                <option value="standard">Standard - Recommended</option>
                <option value="full">Full - All features enabled</option>
              </select>
            </div>

            <div style={{
              padding: 16,
              borderRadius: 12,
              background: 'white',
              border: '1px solid #E8E8E8',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#C9A96A20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Globe size={20} style={{ color: '#C9A96A' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px 0' }}>
                    Profile Visibility
                  </h4>
                  <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                    Control who can see your profile information
                  </p>
                </div>
              </div>
              <select
                defaultValue="private"
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid #E8E8E8',
                  background: 'white',
                  fontSize: 13,
                  outline: 'none',
                }}
              >
                <option value="private">Private - Only you</option>
                <option value="pharmacy">Pharmacy Staff Only</option>
              </select>
            </div>

            <div style={{
              padding: 16,
              borderRadius: 12,
              background: '#F0F9F4',
              border: '1px solid #2E7D5B30',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <CheckCircle size={20} style={{ color: '#2E7D5B' }} />
              <div style={{ fontSize: 13, color: '#2E7D5B', flex: 1 }}>
                <strong>GDPR Compliant:</strong> Your data is processed according to EU data protection regulations.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
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
              <Save size={18} />
              Save Privacy Settings
            </button>
            
            <button
              style={{
                padding: '12px 24px',
                borderRadius: 10,
                border: '1px solid #DC2626',
                background: 'white',
                color: '#DC2626',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FEF2F2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              Download My Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
