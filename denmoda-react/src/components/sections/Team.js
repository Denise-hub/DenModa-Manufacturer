import React from 'react';
import { useData } from '../../context/DataContext';

const Team = () => {
  const { team } = useData();

  // Default team - Co-Founder without WhatsApp/Facebook
  const defaultTeam = [
    {
      id: 't1',
      name: 'Denise M.',
      role: 'Co-Founder',
      description: 'Product Designer & Manager',
      image: '/img/team/team-1.JPG',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/denise-maombi-633269240'
      }
    },
    {
      id: 't2',
      name: 'Joyeuse S.',
      role: 'Communication',
      description: 'In charge of finding partners and customers',
      image: '/img/team/team-5.jpg',
      socialLinks: {}
    },
    {
      id: 't3',
      name: 'Dr Claude',
      role: 'Outsole Manufacturer',
      description: 'In charge of finalizing products',
      image: '/img/team/dr1.JPG',
      socialLinks: {}
    }
  ];

  // Process team data - remove WhatsApp/Facebook for Co-Founder
  const processTeam = (teamData) => {
    return teamData.map(member => {
      if (member.role === 'CEO' || member.role === 'Co-Founder' || member.name === 'Denise M.') {
        return {
          ...member,
          role: 'Co-Founder',
          socialLinks: {
            linkedin: member.socialLinks?.linkedin || 'https://www.linkedin.com/in/denise-maombi-633269240'
          }
        };
      }
      return member;
    });
  };

  // Safely get team array
  const rawTeam = (team && Array.isArray(team) && team.length > 0) ? team : defaultTeam;
  const displayTeam = processTeam(rawTeam);

  return (
    <section id="team" className="team-section">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Our Team</h2>
          <p>Meet the passionate people behind DenModa</p>
        </div>

        <div className="team-grid">
          {displayTeam.map((member, index) => (
            <div 
              key={member.id || index}
              className="team-card"
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 100}
            >
              <div className="team-card-inner">
                {/* Image Container */}
                <div className="team-image-wrapper">
                  <div className="team-image">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      onError={(e) => {
                        if (e.target.src.includes('.JPG')) {
                          e.target.src = e.target.src.replace('.JPG', '.jpg');
                        } else if (e.target.src.includes('.jpg')) {
                          e.target.src = e.target.src.replace('.jpg', '.jpeg');
                        } else {
                          e.target.src = '/assets/denmoda.png';
                        }
                      }}
                    />
                  </div>
                  {/* Role Badge */}
                  <div className="role-badge">
                    {member.role}
                  </div>
                </div>

                {/* Info Container */}
                <div className="team-info">
                  <h4 className="team-name">{member.name}</h4>
                  <p className="team-description">{member.description}</p>
                  
                  {/* Social Links - Only show if there are any */}
                  {member.socialLinks && Object.values(member.socialLinks).some(link => link) && (
                    <div className="team-social">
                      {member.socialLinks?.linkedin && (
                        <a 
                          href={member.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="LinkedIn"
                          className="social-link linkedin"
                        >
                          <i className="bi bi-linkedin"></i>
                        </a>
                      )}
                      {member.socialLinks?.instagram && (
                        <a 
                          href={member.socialLinks.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Instagram"
                          className="social-link instagram"
                        >
                          <i className="bi bi-instagram"></i>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
