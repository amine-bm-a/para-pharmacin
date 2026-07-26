import React, { useState } from 'react';
import { 
  User, 
  Edit, 
  Save, 
  Phone, 
  Mail, 
  AlertTriangle,
  Heart,
  Sparkles,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const HealthProfile = () => {
  const [expandedSection, setExpandedSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const healthData = {
    personal: {
      skinType: 'Combination',
      hairType: 'Normal',
      allergies: ['Penicillin', 'Latex'],
      preferredBrands: ['La Roche-Posay', 'Vichy', 'Bioderma'],
      healthGoals: ['Acne Prevention', 'Anti-aging', 'Hydration'],
    },
    emergency: {
      contactName: 'John Doe',
      relationship: 'Spouse',
      phone: '+212 6 12 34 56 78',
    },
    preferences: {
      communication: 'Email',
      language: 'French',
      notifications: true,
      privacy: 'Standard',
    },
  };

  const sections = [
    {
      id: 'personal',
      title: 'Personal Health Information',
      icon: User,
      color: '#2E7D5B',
    },
    {
      id: 'emergency',
      title: 'Emergency Contact',
      icon: AlertTriangle,
      color: '#C9A96A',
    },
    {
      id: 'preferences',
      title: 'Health Preferences',
      icon: Sparkles,
      color: '#8FAF9B',
    },
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
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
            My Health Profile
          </h2>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
            Manage your health information and preferences
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            padding: '12px 24px',
            borderRadius: 10,
            border: isEditing ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
            background: isEditing ? '#2E7D5B' : 'white',
            color: isEditing ? 'white' : '#666',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!isEditing) {
              e.currentTarget.style.background = '#F6F1EB';
              e.currentTarget.style.borderColor = '#2E7D5B';
            }
          }}
          onMouseLeave={(e) => {
            if (!isEditing) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#E8E8E8';
            }
          }}
        >
          {isEditing ? <Save size={18} /> : <Edit size={18} />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Health Profile Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          
          return (
            <div
              key={section.id}
              style={{
                borderRadius: 16,
                border: '1px solid #E8E8E8',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
            >
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  background: isExpanded ? section.color + '10' : 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.background = '#F8F9FA';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: section.color + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={20} style={{ color: section.color }} />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>
                    {section.title}
                  </span>
                </div>
                {isExpanded ? <ChevronUp size={20} style={{ color: '#666' }} /> : <ChevronDown size={20} style={{ color: '#666' }} />}
              </button>

              {isExpanded && (
                <div style={{ padding: '24px', background: '#F8F9FA' }}>
                  {section.id === 'personal' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Skin Type
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: 10,
                          border: isEditing ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
                          background: 'white',
                          fontSize: 14,
                          color: '#1A1A1A',
                        }}>
                          {healthData.personal.skinType}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Hair Type
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: 10,
                          border: isEditing ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
                          background: 'white',
                          fontSize: 14,
                          color: '#1A1A1A',
                        }}>
                          {healthData.personal.hairType}
                        </div>
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Allergies
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {healthData.personal.allergies.map((allergy, index) => (
                            <span
                              key={index}
                              style={{
                                padding: '6px 14px',
                                borderRadius: 20,
                                background: '#FEF2F2',
                                color: '#DC2626',
                                fontSize: 13,
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              <AlertTriangle size={14} />
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Preferred Brands
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {healthData.personal.preferredBrands.map((brand, index) => (
                            <span
                              key={index}
                              style={{
                                padding: '6px 14px',
                                borderRadius: 20,
                                background: '#F0F9F4',
                                color: '#2E7D5B',
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                            >
                              {brand}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Health Goals
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {healthData.personal.healthGoals.map((goal, index) => (
                            <span
                              key={index}
                              style={{
                                padding: '6px 14px',
                                borderRadius: 20,
                                background: '#F6F1EB',
                                color: '#C9A96A',
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                            >
                              <Heart size={14} style={{ display: 'inline' }} />
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'emergency' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Contact Name
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: 10,
                          border: isEditing ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
                          background: 'white',
                          fontSize: 14,
                          color: '#1A1A1A',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <User size={18} style={{ color: '#666' }} />
                          {healthData.emergency.contactName}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Relationship
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: 10,
                          border: isEditing ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
                          background: 'white',
                          fontSize: 14,
                          color: '#1A1A1A',
                        }}>
                          {healthData.emergency.relationship}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Phone Number
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: 10,
                          border: isEditing ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
                          background: 'white',
                          fontSize: 14,
                          color: '#1A1A1A',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <Phone size={18} style={{ color: '#666' }} />
                          {healthData.emergency.phone}
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'preferences' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Communication Preference
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: 10,
                          border: isEditing ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
                          background: 'white',
                          fontSize: 14,
                          color: '#1A1A1A',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <Mail size={18} style={{ color: '#666' }} />
                          {healthData.preferences.communication}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Language
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: 10,
                          border: isEditing ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
                          background: 'white',
                          fontSize: 14,
                          color: '#1A1A1A',
                        }}>
                          {healthData.preferences.language}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Notifications
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: 10,
                          border: isEditing ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
                          background: 'white',
                          fontSize: 14,
                          color: '#1A1A1A',
                        }}>
                          {healthData.preferences.notifications ? 'Enabled' : 'Disabled'}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>
                          Privacy Settings
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: 10,
                          border: isEditing ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
                          background: 'white',
                          fontSize: 14,
                          color: '#1A1A1A',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <Shield size={18} style={{ color: '#666' }} />
                          {healthData.preferences.privacy}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Privacy Notice */}
      <div style={{
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        background: '#F0F9F4',
        border: '1px solid #2E7D5B30',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <Shield size={20} style={{ color: '#2E7D5B' }} />
        <div style={{ fontSize: 13, color: '#2E7D5B', flex: 1 }}>
          <strong>Privacy Protected:</strong> Your health information is encrypted and only shared with authorized healthcare providers.
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;
