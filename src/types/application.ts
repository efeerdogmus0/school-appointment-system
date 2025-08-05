export const fieldLabels: { [key: string]: string } = {
  appointmentDate: 'Randevu Tarihi',
  appointmentTime: 'Randevu Saati',
  studentName: 'Öğrenci Adı Soyadı',
  studentTC: 'Öğrenci T.C. Kimlik No',
  studentPrevSchool: 'Bitirdiği Okul',
  studentPhone: 'Öğrenci Cep Telefonu',
  studentEmail: 'Öğrenci E-posta Adresi',
  studentAddress: 'Öğrenci İkamet Adresi',
  guardianName: 'Veli Adı Soyadı',
  guardianTC: 'Veli T.C. Kimlik No',
  guardianPhoneCell: 'Veli Cep Telefonu',
  guardianEmail: 'Veli E-posta Adresi',
  guardianAddressHome: 'Veli Ev Adresi',
  guardianProximity: 'Okula Yakınlık Durumu',
  fatherName: 'Baba Adı Soyadı',
  fatherTC: 'Baba T.C. Kimlik No',
  fatherPhone: 'Baba Cep Telefonu',
  fatherEmail: 'Baba E-posta Adresi',
  fatherJob: 'Baba Mesleği',
  fatherWorkplace: 'Baba İşyeri Adı',
  fatherWorkAddress: 'Baba İş Adresi',
  lgsScore: 'LGS Puanı',
  lgsPercentileTurkey: 'LGS Türkiye Geneli Yüzdelik Dilim',
  lgsPercentileCity: 'LGS İl Geneli Yüzdelik Dilim',
  mathCorrect: 'Matematik Doğru',
  mathIncorrect: 'Matematik Yanlış',
  mathNet: 'Matematik Net',
  scienceCorrect: 'Fen Bilimleri Doğru',
  scienceIncorrect: 'Fen Bilimleri Yanlış',
  scienceNet: 'Fen Bilimleri Net',
  turkishCorrect: 'Türkçe Doğru',
  turkishIncorrect: 'Türkçe Yanlış',
  turkishNet: 'Türkçe Net',
  historyCorrect: 'T.C. İnk. Tarihi Doğru',
  historyIncorrect: 'T.C. İnk. Tarihi Yanlış',
  historyNet: 'T.C. İnk. Tarihi Net',
  religionCorrect: 'Din Kültürü Doğru',
  religionIncorrect: 'Din Kültürü Yanlış',
  religionNet: 'Din Kültürü Net',
  englishCorrect: 'Yabancı Dil Doğru',
  englishIncorrect: 'Yabancı Dil Yanlış',
  englishNet: 'Yabancı Dil Net',
  schoolPreference: 'Okulumuzu Kaçıncı Sırada Tercih Ettiniz?',
  schoolChoiceReason: 'Okulumuzu Tercih Etme Nedeniniz',
  hobbies: 'Öğrencinin Hobileri/İlgi Alanları',
  futureGoals: 'Öğrencinin Gelecek Hedefleri',
};

export interface ApplicationData {
  // Base Info
  id: string;
  createdAt: string;
  appointmentDate: string;
  appointmentTime: string;

  // Student Info
  studentTC: string;
  studentName: string;
  studentDob?: string;
  studentPob?: string;
  studentPhone: string;
  studentEmail?: string;
  studentAddress?: string;
  studentPrevSchool?: string;
  studentBloodType?: string;
  studentDisability?: string;
  studentChronicIllness?: string;
  parentsTogether?: string;
  parentsBiological?: string;

  // Guardian Info (Mother, Father, or Legal Guardian)
  guardianName: string;
  guardianTC?: string;
  guardianEducation?: string;
  guardianOccupation?: string;
  guardianPhoneCell: string;
  guardianPhoneHome?: string;
  guardianPhoneWork?: string;
  guardianEmail: string;
  guardianBloodType?: string;
  guardianAddressHome?: string;
  guardianAddressWork?: string;
  guardianChronicIllness?: string;
  guardianDisability?: string;
  guardianIncome?: string;
  guardianProximity?: string;

  // Father Info (if different from guardian)
  fatherName?: string;
  fatherAlive?: string;
  fatherTC?: string;
  fatherEducation?: string;
  fatherOccupation?: string;
  fatherPhoneCell?: string;
  fatherPhoneHome?: string;
  fatherPhoneWork?: string;
  fatherEmail?: string;
  fatherBloodType?: string;
  fatherAddressHome?: string;
  fatherAddressWork?: string;
  fatherChronicIllness?: string;
  fatherDisability?: string;
  fatherIncome?: string;
  
  // LGS and Exam Info
  lgsScore?: string | number;
  lgsPercentileTurkey?: string | number;
  lgsPercentileCity?: string | number;
  scholarshipWon?: string;
  tubitakInterest?: string;
  turkishCorrect?: string | number;
  turkishWrong?: string | number;
  turkishNet?: number;
  mathCorrect?: string | number;
  mathWrong?: string | number;
  mathNet?: number;
  scienceCorrect?: string | number;
  scienceWrong?: string | number;
  scienceNet?: number;
  englishCorrect?: string | number;
  englishWrong?: string | number;
  englishNet?: number;
  religionCorrect?: string | number;
  religionWrong?: string | number;
  religionNet?: number;
  historyCorrect?: string | number;
  historyWrong?: string | number;
  historyNet?: number;

  // Opinions and Suggestions
  opinionSchool?: string;
  opinionExpectations?: string;
  opinionSuggestions?: string;
  supportSchool?: string;
  joinPta?: string;
  schoolPreference?: string;
  schoolChoiceReason?: string;
  hobbies?: string;
  futureGoals?: string;
}
