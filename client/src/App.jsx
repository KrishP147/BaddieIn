import { useCallback, useState, useEffect, useRef } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import { FaLinkedin, FaLock } from 'react-icons/fa';
import PackOpening from './PackOpening';
import Roster from './Roster';
import MessageComposer from './MessageComposer';

// Custom Dropdown Component
const CustomDropdown = ({ value, options, onChange, placeholder = 'Select an option...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const displayValue = value || placeholder;

  return (
    <div className="relative dropdown-wrapper" ref={dropdownRef} style={{ zIndex: 1000 }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 text-white text-xl md:text-2xl border-2 border-white/20 rounded-2xl p-4 pr-12 focus:outline-none transition-all duration-300 cursor-pointer hover:bg-white/10 flex items-center justify-between"
        style={{
          height: '64px',
          minHeight: '64px',
          maxHeight: '64px',
          boxSizing: 'border-box'
        }}
      >
        <span className={value ? 'text-white' : 'text-white/50'}>{displayValue}</span>
        <svg 
          className={`w-6 h-6 text-white/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-white/5 border-2 border-white/20 rounded-2xl shadow-2xl backdrop-blur-sm"
          style={{
            zIndex: 10001,
            position: 'absolute'
          }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div 
            className="overflow-y-auto custom-scrollbar"
            style={{
              maxHeight: '250px',
              overflowY: 'auto',
              overflowX: 'hidden',
              overscrollBehavior: 'contain'
            }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {options && options.length > 0 ? (
              options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-3 text-base text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer ${
                    value === option ? 'bg-white/15' : ''
                  }`}
                  style={{
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-white/50 text-center">No options available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => (prev + 0.05) % (Math.PI * 2));
      setRotation(prev => (prev + 0.5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const glowOpacity = 0.5 + Math.sin(glowIntensity) * 0.3;
  const glowScale = 1 + Math.sin(glowIntensity) * 0.1;

  return (
    <div 
      className="relative w-80 h-[480px] cursor-pointer group transition-transform duration-300"
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        perspective: '1000px',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      {/* Multi-layered animated glow effect */}
      <div 
        className="absolute -inset-6 rounded-3xl blur-3xl transition-all duration-500"
        style={{ 
          opacity: glowOpacity,
          transform: `scale(${glowScale}) rotate(${rotation}deg)`,
          background: `conic-gradient(from ${rotation}deg, #ec4899, #a855f7, #3b82f6, #ec4899)`
        }}
      />
      <div 
        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 blur-2xl"
        style={{ 
          opacity: glowOpacity * 0.7,
          transform: `scale(${glowScale * 0.9}) rotate(${-rotation}deg)`
        }}
      />
      
      <div 
        className="relative w-full h-full transition-transform duration-700 preserve-3d z-20"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Prestigious solid metallic gold border - only border frame */}
        <div 
          className="absolute inset-0 rounded-3xl z-10 backface-hidden pointer-events-none"
          style={{
            padding: '3px',
            background: 'linear-gradient(135deg, #8b6914 0%, #A57B00 25%, #b8860b 50%, #A57B00 75%, #8b6914 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            backfaceVisibility: 'visible'
          }}
        >
          <div className="w-full h-full rounded-3xl bg-transparent"></div>
        </div>
        <div 
          className="absolute inset-0 rounded-3xl z-10 animate-metallic-shine backface-hidden pointer-events-none"
          style={{
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            backfaceVisibility: 'visible'
          }}
        >
          <div 
            className="w-full h-full rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #A57B00 0%, #c99a1a 20%, #d4af37 40%, #c99a1a 60%, #A57B00 100%)'
            }}
          ></div>
        </div>
        
        {/* Front of card */}
        <div
          className="absolute w-full h-full backface-hidden rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Card content */}
          <div className="relative h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Profile Image */}
            <div className="h-[280px] relative overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/30 via-purple-600/30 to-blue-600/30" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Outer animated glow rings */}
                  <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 blur-2xl opacity-50 animate-spin-slow animate-pulse-scale" />
                  <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-60 animate-spin-reverse animate-pulse-scale-delayed" />
                  <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 blur-lg opacity-40 animate-spin-slow" />
                  
                  {/* Animated rotating border ring */}
                  <div className="absolute inset-0 -m-1 rounded-full animate-rotate-border" style={{
                    width: 'calc(100% + 8px)',
                    height: 'calc(100% + 8px)',
                    background: 'conic-gradient(from 0deg, #ec4899, #a855f7, #3b82f6, #ec4899)',
                    borderRadius: '50%',
                    padding: '4px',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor'
                  }}>
                    <div className="w-full h-full rounded-full bg-transparent"></div>
                  </div>
                  
                  {/* Avatar */}
                  <div className="relative w-52 h-52 rounded-full overflow-hidden shadow-2xl border-4 border-white/30">
                    <img 
                      src="/camille-yang.jpeg"
                      alt="camille yang"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gradient-to-br', 'from-pink-500', 'via-purple-500','to-blue-500', 'flex', 'items-center', 'justify-center');
                        e.target.parentElement.innerHTML = '<span class="text-white text-7xl font-bold">GL</span>';
                      }}
                    />
                  </div>
                  
                  {/* Inner glow pulse */}
                  <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-r from-pink-400/50 via-purple-400/50 to-blue-400/50 blur-md animate-pulse-glow-inner" />
                </div>
              </div>
              
              {/* Subtle ambient glow effect */}
              <div 
                className="absolute inset-0 animate-gentle-pulse pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.05) 0%, transparent 70%)'
                }}
              />
            </div>
            
            {/* Border divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            {/* Profile Info */}
            <div className="flex-1 flex flex-col items-center justify-start p-8 pt-8 space-y-3 text-center">
              <h3 className="text-4xl font-bold text-white tracking-tight">
                Camille Yang
              </h3>
              
              <div className="space-y-2">
                <div className="text-white/90 text-lg font-medium">
                  CS @uwaterloo
                </div>
                <div className="text-white/90 text-lg font-medium">
                  SDE @amazon
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-400/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Shine animation overlay */}
          <div className="absolute inset-0 animate-shine pointer-events-none rounded-3xl"></div>
          
          <div className="h-full flex items-center justify-center p-8 relative z-10">
            {/* LinkedIn Logo */}
            <a 
              href="https://www.linkedin.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-all duration-300 hover:scale-125"
            >
              <FaLinkedin size={48} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Hover instruction */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-white/50 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Click to flip card
      </div>
    </div>
  );
};

function DatingLandingPage({
  packCards = [],
  onPackCardsGenerated,
  onCardLiked,
  packFetchError = null,
  onPackFetchError,
  onSurveyComplete,
  onGenderPreferenceSet,
  onFetchNewPack = null,
  genderPreference = null,
  onSwitchToPackTab = null,
  setCurrentSchoolForPack = null
}) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [surveyStarted, setSurveyStarted] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showPackOpening, setShowPackOpening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [prevQuestion, setPrevQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState('forward'); // 'forward' or 'backward'
  const [isFetchingPack, setIsFetchingPack] = useState(false);
  const [isCompletingSurvey, setIsCompletingSurvey] = useState(false);

  const questions = [
    {
      id: 'industry',
      question: 'What industry are you interested in?',
      options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Business', 'Self-Employed', 'Other'],
      type: 'multiple-choice'
    },
    {
      id: 'major',
      question: 'What major are you looking for?',
      options: ['Math', 'Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 'Other'],
      type: 'multiple-choice'
    },
    {
      id: 'school',
    question: 'Which school do you prefer?',
      type: 'dropdown',
      options: [
      'UC Irvine',
      'UC Riverside',
      'UCLA',
      'UBC',
      'UWaterloo',
      'NYU',
      'Stanford'
      ]
    },
    {
      id: 'gender',
      question: 'What gender partner are you looking for?',
      options: ['Male', 'Female', 'Both'],
      type: 'multiple-choice'
    }
  ];

  const completeSurvey = useCallback(async (finalAnswers) => {
    console.log('🎯 completeSurvey called with answers:', finalAnswers);
    console.log('🔍 All answer keys:', Object.keys(finalAnswers));
    console.log('🔍 All answer values:', Object.values(finalAnswers));
    
    const cityRaw = finalAnswers['school'];
    const genderSelection = finalAnswers['gender'];

    console.log('🔍 Extracted values:', { cityRaw, genderSelection, cityRawType: typeof cityRaw, genderSelectionType: typeof genderSelection });

    if (!cityRaw || !genderSelection) {
      const missingFields = [];
      if (!cityRaw) missingFields.push('school');
      if (!genderSelection) missingFields.push('gender');
      
      console.warn('❌ Missing required fields:', missingFields);
      console.warn('❌ All answers received:', finalAnswers);
      console.warn('❌ Current question index:', currentQuestion);
      console.warn('❌ Questions:', questions.map((q, i) => `${i}: ${q.id}`));
      
      onPackFetchError?.(`Please provide both a school preference and a gender preference. Missing: ${missingFields.join(', ')}`);
      onPackCardsGenerated?.([]);
      setShowPackOpening(true);
      onSwitchToPackTab?.();
      return;
    }

    const normalizedGender = genderSelection.toLowerCase();
    console.log('🔍 Gender selection:', { original: genderSelection, normalized: normalizedGender });
    
    const genderQueries =
      normalizedGender === 'both'
        ? ['man', 'woman']
        : normalizedGender === 'male'
          ? ['man']
          : normalizedGender === 'female'
            ? ['woman']
            : [];

    console.log('🔍 Gender queries:', genderQueries);

    if (!genderQueries.length) {
      const message = `Unsupported gender selection "${genderSelection}".`;
      console.warn('❌', message);
      onPackFetchError?.(message);
      onPackCardsGenerated?.([]);
      setShowPackOpening(true);
      return;
    }

    // Store gender preference for future pack fetches
    onGenderPreferenceSet?.(genderQueries);

    const originalCity = cityRaw.trim();
    const cityQuery = originalCity.toLowerCase();
    
    // Store the current school for delete operations
    setCurrentSchoolForPack?.(originalCity);

    const mapRowToCard = (row, index, genderOption) => {
      if (!row || typeof row !== 'object') {
        return null;
      }

      const getString = (...keys) => {
        for (const key of keys) {
          const value = row?.[key];
          if (typeof value === 'string' && value.trim()) {
            return value.trim();
          }
        }
        return undefined;
      };

      const firstName = getString('firstName', 'givenName');
      const lastName = getString('lastName', 'familyName');

      let fullName =
        getString('fullName', 'name', 'profileFullName', 'profileName') ||
        [firstName, lastName].filter(Boolean).join(' ').trim();
      if (!fullName) {
        fullName = `LinkedIn Candidate ${index + 1}`;
      }

      const location =
        getString('location', 'locationName', 'geo', 'city', 'headlineLocation') || originalCity;

      let headline = getString('headline', 'occupation', 'title', 'jobTitle', 'summary', 'position');
      const companyRaw = getString('company', 'companyName', 'currentCompany', 'employer', 'organization');
      let resolvedCompany = companyRaw;
      if (!resolvedCompany && headline) {
        const atMatch = headline.match(/\bat\s+(.+)/i);
        if (atMatch) {
          resolvedCompany = atMatch[1].trim();
        }
      }

      const major =
        getString('education', 'school', 'schoolName', 'degree', 'fieldOfStudy', 'program') ||
        headline ||
        'LinkedIn Search Result';

      const linkedinUrl =
        getString('profileUrl', 'linkedinUrl', 'publicProfileUrl', 'url', 'profile', 'profileLink') ||
        'https://www.linkedin.com';

      const imageUrl =
        getString(
          'profilePictureUrl',
          'profilePictureUrlOriginal',
          'pictureUrl',
          'imageUrl',
          'avatarUrl',
          'profileImageUrl',
          'photoUrl'
        ) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=111111&color=ff66cc`;

      let interests = [];
      const skillsValue = row?.skills;
      if (Array.isArray(skillsValue) && skillsValue.length) {
        interests = skillsValue.map((skill) => String(skill)).filter(Boolean).slice(0, 4);
      } else if (typeof skillsValue === 'string' && skillsValue.trim()) {
        interests = skillsValue
          .split(/[,;•|]/)
          .map((skill) => skill.trim())
          .filter(Boolean)
          .slice(0, 4);
      } else if (headline) {
        interests = headline
          .split(/[,;•|]/)
          .map((segment) => segment.trim())
          .filter(Boolean)
          .slice(0, 4);
      }

      const rarity =
        index === 0 ? 'legendary' : index === 1 ? 'epic' : index <= 3 ? 'rare' : 'common';

      const bio =
        getString('summary', 'about', 'description', 'bio') ||
        headline ||
        `Based in ${location}`;

      const idCandidate =
        getString('id', 'profileId', 'recordId') ||
        row?.profileUrl ||
        row?.publicProfileUrl ||
        `phantom-${genderOption}-${index}-${Date.now()}`;

      return {
        id: String(idCandidate),
        name: fullName,
        major,
        company: resolvedCompany || headline || 'Open to opportunities',
        image: imageUrl,
        rarity,
        bio,
        location,
        interests,
        email: getString('email', 'emailAddress'),
        linkedin: linkedinUrl,
        headline,
        gender: genderOption
      };
    };

    setIsFetchingPack(true);
    onPackFetchError?.(null);

    try {
      // Get API base URL
      const rawApiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const apiBaseUrl = rawApiBase.replace(/\/$/, '');
      
      const results = await Promise.all(
        genderQueries.map(async (genderOption) => {
          const url = `${apiBaseUrl}/phantombuster/search-cache?query=${encodeURIComponent(
            cityQuery
          )}&gender=${genderOption}`;
          console.log(`🌐 Fetching pack for school: ${cityQuery}, gender: ${genderOption}`);
          const response = await fetch(url);
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error (${response.status}):`, errorText);
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
          }
          const data = await response.json();
          console.log(`✅ [PhantomBuster] city="${cityQuery}" gender="${genderOption}"`, {
            rowCount: data?.csv_row_count || 0,
            totalRows: data?.total_csv_row_count || 0,
            cached: data?.cached || false
          });
          return { gender: genderOption, data };
        })
      );

      const aggregatedCards = [];
      const seenProfiles = new Set();
      // Get roster exclusion set to filter out people already in roster
      const rosterNames = getRosterNames();
      console.log('📋 Pack generation - Roster exclusion set:', Array.from(rosterNames));

      results.forEach(({ gender: genderOption, data }) => {
        const rows = Array.isArray(data?.csv_data) ? data.csv_data : [];
        rows.forEach((row) => {
          const card = mapRowToCard(row, aggregatedCards.length, genderOption);
          if (!card) {
            return;
          }
          const dedupeKey = (card.linkedin || `${card.name}-${card.location}`).toLowerCase();
          if (seenProfiles.has(dedupeKey)) {
            return;
          }
          
          // Filter out cards that are already in the roster
          const normalizedCardName = card.name.trim().toLowerCase();
          if (rosterNames.has(normalizedCardName)) {
            console.log(`🚫 Skipping ${card.name} (normalized: "${normalizedCardName}") - already in roster`);
            return;
          }
          
          seenProfiles.add(dedupeKey);
          aggregatedCards.push(card);
        });
      });

      console.log(`✅ Pack generation complete: ${aggregatedCards.length} cards (filtered out ${rosterNames.size} roster members)`);

      if (!aggregatedCards.length) {
        const errorMsg = 'No LinkedIn profiles returned for this search. Please try a different school or check back later.';
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('✅ Setting pack cards and completing survey...');
      onPackCardsGenerated?.(aggregatedCards);
      try {
        localStorage.removeItem('daily-pack-claimed');
        localStorage.setItem('survey-completed', 'true');
        console.log('✅ Survey completion saved to localStorage');
      } catch (err) {
        console.error('⚠️ Failed to save survey completion:', err);
        // ignore storage errors
      }
      console.log('✅ Calling onSurveyComplete callback...');
      onSurveyComplete?.();
      setShowPackOpening(true);
      // Switch to pack tab after survey completion
      onSwitchToPackTab?.();
      console.log('✅ Survey complete! Switched to pack tab. Pack opening should be visible now.');
    } catch (error) {
      console.error('❌ Error fetching PhantomBuster search cache:', error);
      const message =
        error instanceof Error ? error.message : 'Unable to load search results.';
      console.error('❌ Error message:', message);
      onPackFetchError?.(message);
      onPackCardsGenerated?.([]);
      // Still mark survey as complete and show pack opening even on error
      // so user can see the error message
      try {
        localStorage.setItem('survey-completed', 'true');
      } catch {
        // ignore storage errors
      }
      onSurveyComplete?.();
      setShowPackOpening(true);
      onSwitchToPackTab?.();
      console.log('⚠️ Survey completed with errors, pack opening shown with error message');
    } finally {
      setIsFetchingPack(false);
      console.log('✅ Fetch complete, isFetchingPack set to false');
    }
  }, [onPackCardsGenerated, onPackFetchError, onSurveyComplete, onGenderPreferenceSet, onSwitchToPackTab, setCurrentSchoolForPack]);

  const handleStartSurvey = () => {
    setShowSurvey(true); // Render survey in DOM first (at opacity-0)
    // Use requestAnimationFrame to ensure survey is in DOM before starting fade
    requestAnimationFrame(() => {
      setSurveyStarted(true); // Trigger simultaneous fade-out of hero and fade-in of survey
    });
  };

  const handleAnswer = async (option) => {
    // Prevent double-clicks
    if (isCompletingSurvey || isTransitioning) {
      console.log('⏸️ Already processing, ignoring click');
      return;
    }

    const questionId = questions[currentQuestion].id;
    console.log(`📝 Answer selected: ${option} for question ${questionId} (index ${currentQuestion})`);
    
    const updatedAnswers = {
      ...answers,
      [questionId]: option
    };

    console.log('📋 Updated answers:', updatedAnswers);
    setAnswers(updatedAnswers);

    // Slide out current question to left, then slide in next question from right
    if (currentQuestion < questions.length - 1) {
      console.log(`➡️ Moving to next question (${currentQuestion + 1} of ${questions.length})`);
      setIsTransitioning(true);
      setSlideDirection('forward');
      setPrevQuestion(currentQuestion);
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        // Small delay to ensure new question starts from right
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      }, 500);
    } else {
      // Survey complete - navigate to pack opening
      console.log('✅ Last question answered! Survey complete.');
      console.log('📋 All answers before completion:', updatedAnswers);
      console.log('🔍 Checking required fields...');
      
      // Validate all required answers are present
      const requiredFields = ['industry', 'major', 'school', 'gender'];
      const missingFields = requiredFields.filter(field => !updatedAnswers[field]);
      
      if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields);
        console.error('❌ Current answers:', updatedAnswers);
        onPackFetchError?.(`Please answer all questions. Missing: ${missingFields.join(', ')}`);
        return;
      }
      
      console.log('✅ All required fields present. Calling completeSurvey...');
      setIsCompletingSurvey(true);
      try {
        await completeSurvey(updatedAnswers);
        console.log('✅ completeSurvey finished successfully');
      } catch (error) {
        console.error('❌ Error in completeSurvey:', error);
        // Show error to user
        onPackFetchError?.(error instanceof Error ? error.message : 'Failed to complete survey');
      } finally {
        setIsCompletingSurvey(false);
      }
    }
  };

  const handleTextInput = (value) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleDropdownChange = (value) => {
    const questionId = questions[currentQuestion].id;
    console.log(`📝 Dropdown selected: ${value} for question ${questionId} (index ${currentQuestion})`);
    
    const updatedAnswers = {
      ...answers,
      [questionId]: value
    };

    console.log('📋 Updated answers from dropdown:', updatedAnswers);
    setAnswers(updatedAnswers);
    
    // Auto-advance to next question when dropdown option is selected
    if (value && value !== '') {
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          console.log(`➡️ Moving to next question from dropdown (${currentQuestion + 1} of ${questions.length})`);
          setIsTransitioning(true);
          setSlideDirection('forward');
          setPrevQuestion(currentQuestion);
          setTimeout(() => {
            setCurrentQuestion(prev => prev + 1);
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          }, 500);
        } else {
          // Survey complete - navigate to pack opening
          console.log('✅ Last question answered via dropdown! Survey complete. Answers:', updatedAnswers);
          console.log('🚀 Calling completeSurvey from dropdown...');
          setIsCompletingSurvey(true);
          completeSurvey(updatedAnswers).catch((error) => {
            console.error('❌ Error in completeSurvey from dropdown:', error);
            onPackFetchError?.(error instanceof Error ? error.message : 'Failed to complete survey');
          }).finally(() => {
            setIsCompletingSurvey(false);
          });
        }
      }, 300);
    }
  };
  const handleTextSubmit = async () => {
    const currentAnswer = answers[questions[currentQuestion].id];
    if (currentAnswer && currentAnswer.trim() !== '') {
      // Slide out current question to left, then slide in next question from right
      if (currentQuestion < questions.length - 1) {
        setIsTransitioning(true);
        setSlideDirection('forward');
        setPrevQuestion(currentQuestion);
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          requestAnimationFrame(() => {
            setIsTransitioning(false);
          });
        }, 500);
      } else {
        // Survey complete - navigate to pack opening
        console.log('Survey answers:', answers);
        await completeSurvey(answers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setSlideDirection('backward');
      setPrevQuestion(currentQuestion);
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      }, 500);
    } else {
      // Go back to landing page
      setShowSurvey(false);
      setSurveyStarted(false);
      setCurrentQuestion(0);
      setAnswers({});
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesConfig = {
    particles: {
      number: {
        value: 200,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.8,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: 2,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.1,
          sync: false
        }
      },
      links: {
        enable: false
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        random: false,
        straight: false,
        outModes: {
          default: "out"
        },
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: {
          enable: true,
          mode: "attract",
          parallax: {
            enable: true,
            force: 60,
            smooth: 10
          }
        },
        onClick: {
          enable: false
        },
        resize: true
      },
      modes: {
        attract: {
          distance: 200,
          duration: 0.4,
          easing: "ease-out-quad",
          factor: 1,
          speed: 1
        }
      }
    },
    detectRetina: true
  };

  // Calculate parallax offset based on mouse position
  const parallaxX = (mousePosition.x - 50) * 0.02;
  const parallaxY = (mousePosition.y - 50) * 0.02;

  // Show loading state while fetching pack data
  if (isFetchingPack) {
    return (
      <div className="h-screen w-screen bg-black text-white overflow-hidden fixed inset-0 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center text-3xl">⏳</span>
        </div>
        <p className="text-xl text-white/80">Curating your pack...</p>
      </div>
    );
  }

  // Show PackOpening after survey is complete
  if (showPackOpening) {
    return (
      <PackOpening
        cards={packCards}
        fetchError={packFetchError}
        onCardLiked={onCardLiked}
        onFetchNewPack={onFetchNewPack}
        genderPreference={genderPreference}
      />
    );
  }

  return (
    <div 
      className="h-screen w-screen bg-black text-white overflow-hidden fixed inset-0"
      onMouseMove={(e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setMousePosition({ x, y });
      }}
    >
      {/* Starfield Background with parallax */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${parallaxX}px, ${parallaxY}px) scale(1.05)`
        }}
      >
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesConfig}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 h-full flex items-center justify-center px-6">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content (fades out) or Survey Questions (fades in) */}
          <div className="text-left lg:pl-8 relative min-h-[400px]">
            {/* Hero Content - Fades out */}
            <div 
              className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                surveyStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white drop-shadow-2xl">
                  Scroll Less,<br />Find More
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-10 text-white/80 drop-shadow-lg max-w-xl">
                  Find your first linkedin baddie TODAY! Based on your industry, major, and school.
                </p>
                <div className="relative inline-block">
                  {/* Neon glow layers */}
                  <div className="absolute inset-0 rounded-full bg-pink-500 blur-xl opacity-75 animate-pulse-glow"></div>
                  <div className="absolute inset-0 rounded-full bg-pink-400 blur-2xl opacity-50 animate-pulse-glow-delayed"></div>
                  <div className="absolute -inset-1 rounded-full bg-pink-300 blur-sm opacity-60 animate-pulse-glow-slow"></div>
                  {/* Button */}
                  <button 
                    onClick={handleStartSurvey}
                    className="relative bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 text-white px-12 py-5 rounded-full text-xl font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.6),0_0_40px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8),0_0_60px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Choose Your Preferences Now
                  </button>
                </div>
            </div>

            {/* Survey Questions - Fades in simultaneously with hero fade-out */}
            {showSurvey && (
              <div 
                className={`absolute inset-0 w-full transition-opacity duration-300 ease-in-out ${
                  surveyStarted ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ overflow: 'visible' }}
              >
                {/* Progress indicator - Always visible, outside transitioning content */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-sm">Question {currentQuestion + 1} of {questions.length}</span>
                    <span className="text-white/60 text-sm">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all duration-500 rounded-full"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question content - Slides left/right */}
                <div className="relative" style={{ overflowX: 'hidden', overflowY: 'visible' }}>
                  {/* Previous question sliding out */}
                  {isTransitioning && (
                    <div 
                      key={`prev-${prevQuestion}`}
                      className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                        slideDirection === 'forward' 
                          ? '-translate-x-full'  // Slide out to left when going forward
                          : 'translate-x-full'   // Slide out to right when going backward
                      }`}
                    >
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 drop-shadow-2xl">
                        {questions[prevQuestion].question}
                      </h2>
                      {questions[prevQuestion].type === 'text-input' ? (
                        <div className="flex items-center gap-4 opacity-50">
                          <input
                            type="text"
                            value={answers[questions[prevQuestion].id] || ''}
                            disabled
                            className="flex-1 bg-transparent text-white/80 text-2xl md:text-3xl"
                          />
                          <span className="text-3xl md:text-4xl text-white/30">→</span>
                        </div>
                      ) : questions[prevQuestion].type === 'dropdown' ? (
                        <div className="opacity-50 pointer-events-none">
                          <div className="w-full bg-white/5 text-white/80 text-xl md:text-2xl border-2 border-white/20 rounded-2xl p-4 pr-12 flex items-center justify-between"
                            style={{
                              height: '64px',
                              minHeight: '64px',
                              maxHeight: '64px',
                              boxSizing: 'border-box'
                            }}
                          >
                            <span className={answers[questions[prevQuestion].id] ? 'text-white/80' : 'text-white/50'}>
                              {answers[questions[prevQuestion].id] || 'Select an option...'}
                            </span>
                            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {questions[prevQuestion].options.map((option, index) => (
                            <button
                              key={index}
                              disabled
                              className="p-3 rounded-xl text-center bg-white/5 text-white/80 border border-white/10 opacity-50"
                            >
                              <span className="text-sm md:text-base font-medium">{option}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Current question - slides in from right/left based on direction */}
                  <div 
                    key={`current-${currentQuestion}`}
                    className={`transition-transform duration-500 ease-in-out ${
                      isTransitioning && currentQuestion !== prevQuestion
                        ? (slideDirection === 'forward'
                          ? 'translate-x-full'   // New question starting from right when going forward
                          : '-translate-x-full')  // New question starting from left when going backward
                        : isTransitioning && currentQuestion === prevQuestion
                        ? (slideDirection === 'forward'
                          ? '-translate-x-full'  // Current question sliding out to left when going forward
                          : 'translate-x-full')   // Current question sliding out to right when going backward
                        : 'translate-x-0'         // Normal position
                    }`}
                  >
                    {/* Question */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 drop-shadow-2xl">
                      {questions[currentQuestion].question}
                    </h2>
                    {/* Loading indicator when completing survey */}
                    {isCompletingSurvey && (
                      <div className="mb-8 flex items-center justify-center gap-3 text-white/80">
                        <div className="w-6 h-6 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg">Loading your pack...</span>
                      </div>
                    )}

                    {/* Multiple Choice Options, Text Input, or Dropdown */}
                    {questions[currentQuestion].type === 'text-input' ? (
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          value={answers[questions[currentQuestion].id] || ''}
                          onChange={(e) => handleTextInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleTextSubmit();
                            }
                          }}
                          placeholder={questions[currentQuestion].placeholder}
                          className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none text-2xl md:text-3xl"
                        />
                        <button
                          onClick={handleTextSubmit}
                          disabled={!answers[questions[currentQuestion].id] || answers[questions[currentQuestion].id].trim() === ''}
                          className={`text-3xl md:text-4xl transition-all duration-300 ${
                            answers[questions[currentQuestion].id] && answers[questions[currentQuestion].id].trim() !== ''
                              ? 'text-white cursor-pointer hover:scale-110'
                              : 'text-white/30 cursor-not-allowed'
                          }`}
                        >
                          →
                        </button>
                      </div>
                    ) : questions[currentQuestion].type === 'dropdown' ? (
                      <CustomDropdown
                        value={answers[questions[currentQuestion].id] || ''}
                        options={questions[currentQuestion].options}
                        onChange={(value) => handleDropdownChange(value)}
                        placeholder="Select an option..."
                      />
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-2">
                        {questions[currentQuestion].options.map((option, index) => {
                          const isSelected = answers[questions[currentQuestion].id] === option;
                          return (
                            <button
                              key={index}
                              onClick={() => handleAnswer(option)}
                              disabled={isCompletingSurvey || isTransitioning}
                              className={`p-3 rounded-xl text-center transition-all duration-300 transform ${
                                isCompletingSurvey || isTransitioning
                                  ? 'cursor-not-allowed opacity-50'
                                  : 'cursor-pointer'
                              } ${
                                isSelected
                                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-pink-500/50 scale-105'
                                  : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10 hover:scale-[1.02]'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-sm md:text-base font-medium">{option}</span>
                                {isSelected && (
                                  <span className="text-lg">✓</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Previous button */}
                    <div className="mt-8">
                      <button
                        onClick={handlePrevious}
                        className="text-white/80 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2 text-lg font-medium"
                      >
                        <span>←</span>
                        <span>Previous</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right side - Card demo (stays visible) */}
          <div className="flex flex-col items-center justify-center lg:justify-end lg:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center lg:text-right drop-shadow-lg">
              Your Profile
            </h2>
            <ProfileCard />
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility functions for roster exclusion
const getRosterNames = () => {
  try {
    const stored = localStorage.getItem('roster-names');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const addToRosterNames = (name) => {
  try {
    const names = getRosterNames();
    const normalizedName = name.trim().toLowerCase();
    if (normalizedName) {
      names.add(normalizedName);
      localStorage.setItem('roster-names', JSON.stringify([...names]));
    }
  } catch (err) {
    console.error('Failed to add name to roster exclusion:', err);
  }
};

const removeFromRosterNames = (name) => {
  try {
    const names = getRosterNames();
    const normalizedName = name.trim().toLowerCase();
    if (normalizedName) {
      names.delete(normalizedName);
      localStorage.setItem('roster-names', JSON.stringify([...names]));
    }
  } catch (err) {
    console.error('Failed to remove name from roster exclusion:', err);
  }
};

// Main App Component with Tabs
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [likedCards, setLikedCards] = useState([]);
  const [packCards, setPackCards] = useState([]);
  const [packFetchError, setPackFetchError] = useState(null);
  const [currentSchoolForPack, setCurrentSchoolForPack] = useState(null);
  const [userGenderPreference, setUserGenderPreference] = useState(null); // Store gender preference from survey
  const [surveyCompleted, setSurveyCompleted] = useState(() => {
    try {
      return localStorage.getItem('survey-completed') === 'true';
    } catch {
      return false;
    }
  });

  // Load existing liked cards from localStorage on mount and sync roster names
  useEffect(() => {
    try {
      const stored = localStorage.getItem('liked-cards');
      if (stored) {
        const cards = JSON.parse(stored);
        setLikedCards(cards);
        // Sync roster names with existing cards
        cards.forEach((card) => {
          if (card.name) {
            addToRosterNames(card.name);
          }
        });
      }
    } catch (err) {
      console.error('Failed to load liked cards:', err);
    }
  }, []);

  // Save liked cards to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('liked-cards', JSON.stringify(likedCards));
    } catch (err) {
      console.error('Failed to save liked cards:', err);
    }
  }, [likedCards]);

  const handleCardLiked = (card) => {
    setLikedCards((prev) => [...prev, card]);
    // Add to roster exclusion set
    if (card.name) {
      const normalizedName = card.name.trim().toLowerCase();
      console.log(`➕ Adding ${card.name} (normalized: "${normalizedName}") to roster exclusion set`);
      addToRosterNames(card.name);
      console.log('📋 Updated roster exclusion set:', Array.from(getRosterNames()));
    }
  };

  const handleCardRemoved = (card) => {
    setLikedCards((prev) => prev.filter((c) => c.id !== card.id));
    // DO NOT remove from roster exclusion set - keep them excluded from future packs
    // This ensures deleted cards won't appear in new packs
    console.log(`🗑️ Removed ${card.name} from roster, but keeping them excluded from future packs`);
  };

  // Function to fetch a new pack based on city (for continuous pack opening)
  const fetchNewPackByCity = useCallback(async (city, gender = null) => {
    const cityQuery = city.trim().toLowerCase();
    const originalCity = city.trim();
    
    // Update current school when fetching new pack
    setCurrentSchoolForPack(originalCity);
    
    // Use provided gender or fall back to stored preference, or default to both
    const genderQueries = gender || userGenderPreference || ['man', 'woman'];

    const mapRowToCard = (row, index, genderOption) => {
      if (!row || typeof row !== 'object') {
        return null;
      }

      const getString = (...keys) => {
        for (const key of keys) {
          const value = row?.[key];
          if (typeof value === 'string' && value.trim()) {
            return value.trim();
          }
        }
        return undefined;
      };

      const firstName = getString('firstName', 'givenName');
      const lastName = getString('lastName', 'familyName');

      let fullName =
        getString('fullName', 'name', 'profileFullName', 'profileName') ||
        [firstName, lastName].filter(Boolean).join(' ').trim();
      if (!fullName) {
        fullName = `LinkedIn Candidate ${index + 1}`;
      }

      const location =
        getString('location', 'locationName', 'geo', 'city', 'headlineLocation') || originalCity;

      let headline = getString('headline', 'occupation', 'title', 'jobTitle', 'summary', 'position');
      const companyRaw = getString('company', 'companyName', 'currentCompany', 'employer', 'organization');
      let resolvedCompany = companyRaw;
      if (!resolvedCompany && headline) {
        const atMatch = headline.match(/\bat\s+(.+)/i);
        if (atMatch) {
          resolvedCompany = atMatch[1].trim();
        }
      }

      const major =
        getString('education', 'school', 'schoolName', 'degree', 'fieldOfStudy', 'program') ||
        headline ||
        'LinkedIn Search Result';

      const linkedinUrl =
        getString('profileUrl', 'linkedinUrl', 'publicProfileUrl', 'url', 'profile', 'profileLink') ||
        'https://www.linkedin.com';

      const imageUrl =
        getString(
          'profilePictureUrl',
          'profilePictureUrlOriginal',
          'pictureUrl',
          'imageUrl',
          'avatarUrl',
          'profileImageUrl',
          'photoUrl'
        ) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=111111&color=ff66cc`;

      let interests = [];
      const skillsValue = row?.skills;
      if (Array.isArray(skillsValue) && skillsValue.length) {
        interests = skillsValue.map((skill) => String(skill)).filter(Boolean).slice(0, 4);
      } else if (typeof skillsValue === 'string' && skillsValue.trim()) {
        interests = skillsValue
          .split(/[,;•|]/)
          .map((skill) => skill.trim())
          .filter(Boolean)
          .slice(0, 4);
      } else if (headline) {
        interests = headline
          .split(/[,;•|]/)
          .map((segment) => segment.trim())
          .filter(Boolean)
          .slice(0, 4);
      }

      const rarity =
        index === 0 ? 'legendary' : index === 1 ? 'epic' : index <= 3 ? 'rare' : 'common';

      const bio =
        getString('summary', 'about', 'description', 'bio') ||
        headline ||
        `Based in ${location}`;

      const idCandidate =
        getString('id', 'profileId', 'recordId') ||
        row?.profileUrl ||
        row?.publicProfileUrl ||
        `phantom-${genderOption}-${index}-${Date.now()}`;

      return {
        id: String(idCandidate),
        name: fullName,
        major,
        company: resolvedCompany || headline || 'Open to opportunities',
        image: imageUrl,
        rarity,
        bio,
        location,
        interests,
        email: getString('email', 'emailAddress'),
        linkedin: linkedinUrl,
        headline,
        gender: genderOption
      };
    };

    setPackFetchError(null);

    try {
      // Get API base URL
      const rawApiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const apiBaseUrl = rawApiBase.replace(/\/$/, '');
      
      const results = await Promise.all(
        genderQueries.map(async (genderOption) => {
          const url = `${apiBaseUrl}/phantombuster/search-cache?query=${encodeURIComponent(
            cityQuery
          )}&gender=${genderOption}`;
          console.log(`🌐 Fetching pack for school: ${cityQuery}, gender: ${genderOption}`);
          const response = await fetch(url);
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error (${response.status}):`, errorText);
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
          }
          const data = await response.json();
          console.log(`✅ [PhantomBuster] city="${cityQuery}" gender="${genderOption}"`, {
            rowCount: data?.csv_row_count || 0,
            totalRows: data?.total_csv_row_count || 0,
            cached: data?.cached || false
          });
          return { gender: genderOption, data };
        })
      );

      const aggregatedCards = [];
      const seenProfiles = new Set();
      const rosterNames = getRosterNames();
      console.log('📋 Pack generation - Roster exclusion set:', Array.from(rosterNames));

      results.forEach(({ gender: genderOption, data }) => {
        const rows = Array.isArray(data?.csv_data) ? data.csv_data : [];
        rows.forEach((row) => {
          const card = mapRowToCard(row, aggregatedCards.length, genderOption);
          if (!card) {
            return;
          }
          const dedupeKey = (card.linkedin || `${card.name}-${card.location}`).toLowerCase();
          if (seenProfiles.has(dedupeKey)) {
            return;
          }
          
          const normalizedCardName = card.name.trim().toLowerCase();
          if (rosterNames.has(normalizedCardName)) {
            console.log(`🚫 Skipping ${card.name} (normalized: "${normalizedCardName}") - already in roster`);
            return;
          }
          
          seenProfiles.add(dedupeKey);
          aggregatedCards.push(card);
        });
      });

      console.log(`✅ Pack generation complete: ${aggregatedCards.length} cards (filtered out ${rosterNames.size} roster members)`);

      if (!aggregatedCards.length) {
        throw new Error('No LinkedIn profiles returned for this search.');
      }

      setPackCards(aggregatedCards);
    } catch (error) {
      console.error('Error fetching PhantomBuster search cache:', error);
      const message =
        error instanceof Error ? error.message : 'Unable to load search results.';
      setPackFetchError(message);
      setPackCards([]);
      throw error;
    }
  }, [userGenderPreference]);

  // Ensure activeTab is set to 'home' if survey not completed
  // Lock all tabs until survey is completed
  useEffect(() => {
    if (!surveyCompleted) {
      // Force activeTab to 'home' if survey not completed
      setActiveTab('home');
    }
  }, [surveyCompleted]);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden fixed inset-0">
      {/* Tab Navigation */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/50'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => surveyCompleted && setActiveTab('pack')}
            disabled={!surveyCompleted}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
              !surveyCompleted
                ? 'bg-white/5 text-white/30 cursor-not-allowed opacity-50'
                : activeTab === 'pack'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/50 cursor-pointer'
                : 'bg-white/10 text-white/70 hover:bg-white/20 cursor-pointer'
            }`}
            title={!surveyCompleted ? 'Complete the survey to unlock this tab' : ''}
          >
            {!surveyCompleted && <FaLock className="text-sm" />}
            Pack Opening
          </button>
          <button
            onClick={() => surveyCompleted && setActiveTab('roster')}
            disabled={!surveyCompleted}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 relative flex items-center gap-2 ${
              !surveyCompleted
                ? 'bg-white/5 text-white/30 cursor-not-allowed opacity-50'
                : activeTab === 'roster'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/50 cursor-pointer'
                : 'bg-white/10 text-white/70 hover:bg-white/20 cursor-pointer'
            }`}
            title={!surveyCompleted ? 'Complete the survey to unlock this tab' : ''}
          >
            {!surveyCompleted && <FaLock className="text-sm" />}
            Roster
            {surveyCompleted && likedCards.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {likedCards.length}
              </span>
            )}
          </button>
          <button
            onClick={() => surveyCompleted && setActiveTab('messages')}
            disabled={!surveyCompleted}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
              !surveyCompleted
                ? 'bg-white/5 text-white/30 cursor-not-allowed opacity-50'
                : activeTab === 'messages'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/50 cursor-pointer'
                : 'bg-white/10 text-white/70 hover:bg-white/20 cursor-pointer'
            }`}
            title={!surveyCompleted ? 'Complete the survey to unlock this tab' : ''}
          >
            {!surveyCompleted && <FaLock className="text-sm" />}
            💬 Messages
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="h-full pt-20">
        {activeTab === 'home' && (
          <DatingLandingPage
            packCards={packCards}
            onPackCardsGenerated={setPackCards}
            onCardLiked={handleCardLiked}
            packFetchError={packFetchError}
            onPackFetchError={setPackFetchError}
            onSurveyComplete={() => setSurveyCompleted(true)}
            onGenderPreferenceSet={setUserGenderPreference}
            onFetchNewPack={fetchNewPackByCity}
            genderPreference={userGenderPreference}
            onSwitchToPackTab={() => setActiveTab('pack')}
            setCurrentSchoolForPack={setCurrentSchoolForPack}
          />
        )}
        {surveyCompleted && activeTab === 'pack' && (
          <PackOpening
            onCardLiked={handleCardLiked}
            cards={packCards}
            fetchError={packFetchError}
            onFetchNewPack={fetchNewPackByCity}
            genderPreference={userGenderPreference}
            currentSchoolName={currentSchoolForPack}
          />
        )}
        {surveyCompleted && activeTab === 'roster' && (
          <Roster likedCards={likedCards} onRemoveCard={handleCardRemoved} />
        )}
        {surveyCompleted && activeTab === 'messages' && (
          <MessageComposer rosterCards={likedCards} />
        )}
      </div>
    </div>
  );
}