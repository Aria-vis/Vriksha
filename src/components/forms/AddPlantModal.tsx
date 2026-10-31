import React, { useState } from 'react';
import {
  X,
  Camera,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Building2,
  Globe,
  Home,
  Check,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Species, LandType } from '../../types/plant';
import { SpeciesPicker } from './SpeciesPicker';
import { LocationAdjuster } from './LocationAdjuster';
import { compressImage, formatFileSize, CompressionResult } from '../../lib/imageCompression';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';
import { useAuth } from '../../hooks/useAuth';
import { plantsApi } from '../../services/plantsApi';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLat: number;
  currentLng: number;
  onPlantAdded?: () => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  onClose,
  currentLat,
  currentLng,
  onPlantAdded,
}) => {
  const { queueSubmission } = useOfflineQueue();
  const { awardPoints } = useAuth();

  const [step, setStep] = useState<number>(1); // 1: Photo, 2: Species, 3: Location & Land, 4: Success
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [customSpeciesName, setCustomSpeciesName] = useState<string>('');

  const [lat, setLat] = useState<number>(currentLat);
  const [lng, setLng] = useState<number>(currentLng);
  const [addressHint, setAddressHint] = useState<string>('');

  const [landType, setLandType] = useState<LandType>('public');
  const [privateOwnerConsent, setPrivateOwnerConsent] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Photo change handler
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setErrorMessage(null);
    try {
      const result = await compressImage(file, { maxWidth: 800, maxHeight: 800, quality: 0.8 });
      setPhotoPreview(result.dataUrl);
      setPhotoBlob(result.blob);
      setCompressionInfo(result);
    } catch (err) {
      console.error('Image compression error:', err);
      // Fallback: simple FileReader preview
      const reader = new FileReader();
      reader.onload = (evt) => {
        setPhotoPreview(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  // Submission handler
  const handleSubmit = async () => {
    // Safety check for private land
    if (landType === 'private' && !privateOwnerConsent) {
      setErrorMessage('You must confirm landowner consent before sharing plants on private property.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const plantTempId = `temp-${Date.now()}`;
    const speciesName = selectedSpecies ? selectedSpecies.common_name_hi : (customSpeciesName || 'Unknown Plant');

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        // Offline: queue in Dexie
        await queueSubmission({
          tempId: plantTempId,
          speciesId: selectedSpecies?.id,
          speciesName,
          customSpeciesName: customSpeciesName || undefined,
          lat,
          lng,
          addressHint,
          landType,
          privateOwnerConsent,
          notes,
          photoDataUrl: photoPreview || undefined,
          photoBlob: photoBlob || undefined,
        });
      } else {
        // Online: send to API
        await plantsApi.addPlant({
          species_id: selectedSpecies?.id,
          lat,
          lng,
          land_type: landType,
          address_hint: addressHint,
          notes,
          private_owner_consent: privateOwnerConsent,
          photo_data_url: photoPreview || undefined,
        });
      }

      // Award points & celebrate
      awardPoints(10, 'Mapped a new plant');
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1B4D3E', '#C85A32', '#E67E22', '#2E7D32'],
      });

      setStep(4);
      onPlantAdded?.();
    } catch (err) {
      console.error('Submission failed, queueing offline:', err);
      // Fallback queue in Dexie
      await queueSubmission({
        tempId: plantTempId,
        speciesId: selectedSpecies?.id,
        speciesName,
        lat,
        lng,
        addressHint,
        landType,
        privateOwnerConsent,
        notes,
        photoDataUrl: photoPreview || undefined,
      });
      setStep(4);
      onPlantAdded?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setPhotoPreview(null);
    setPhotoBlob(null);
    setCompressionInfo(null);
    setSelectedSpecies(null);
    setCustomSpeciesName('');
    setAddressHint('');
    setLandType('public');
    setPrivateOwnerConsent(false);
    setNotes('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-forest-800 to-forest-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold">
                Step {step} of 3
              </span>
              <span className="text-forest-200">•</span>
              <span className="text-xs text-forest-200">Earn +10 Green Points</span>
            </div>
            <h2 className="text-xl font-bold font-serif tracking-tight">Add a Plant or Tree</h2>
          </div>
          <button
            onClick={resetForm}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-gray-900">Upload a Photo</h3>
                <p className="text-xs text-gray-500">
                  Take a photo of leaves, flowers, or trunk to help others recognize it.
                </p>
              </div>

              {/* Photo preview or dropzone */}
              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-forest-600 transition-colors bg-gray-50/50">
                {photoPreview ? (
                  <div className="space-y-3">
                    <img
                      src={photoPreview}
                      alt="Plant upload preview"
                      className="w-full h-48 object-cover rounded-xl shadow-sm"
                    />
                    {compressionInfo && (
                      <div className="flex items-center justify-center gap-2 text-xs text-forest-700 bg-forest-50 py-1.5 px-3 rounded-lg border border-forest-200">
                        <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                        <span>
                          Compressed: {formatFileSize(compressionInfo.originalSizeBytes)} →{' '}
                          <strong>{formatFileSize(compressionInfo.sizeBytes)}</strong> (
                          {Math.round(compressionInfo.compressionRatio * 100)}% smaller)
                        </span>
                      </div>
                    )}
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer">
                      <Camera className="w-3.5 h-3.5 text-forest-700" />
                      <span>Retake or Choose Another</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-8 cursor-pointer space-y-2">
                    <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center shadow-sm">
                      {isCompressing ? (
                        <UploadCloud className="w-6 h-6 animate-bounce text-forest-700" />
                      ) : (
                        <Camera className="w-6 h-6 text-forest-700" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {isCompressing ? 'Compressing photo...' : 'Tap to Take Photo or Browse'}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Auto-compressed to &lt; 120 KB to save mobile data
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">Select Plant Species</h3>
                <p className="text-xs text-gray-500">
                  Pick the tree or plant type from our 80 useful species catalog.
                </p>
              </div>

              <SpeciesPicker
                selectedSpeciesId={selectedSpecies?.id ?? (selectedSpecies === null ? null : undefined)}
                onSelectSpecies={(sp) => setSelectedSpecies(sp)}
              />

              {/* If "Not sure" selected, allow custom note */}
              {selectedSpecies === null && (
                <div className="space-y-1 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                  <label className="block text-xs font-semibold text-amber-900">
                    What does it look like or what is it called locally?
                  </label>
                  <input
                    type="text"
                    value={customSpeciesName}
                    onChange={(e) => setCustomSpeciesName(e.target.value)}
                    placeholder="e.g. Big leafy sacred tree near pond with white flowers"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg outline-none"
                  />
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Next: Location &amp; Land</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">Location &amp; Land Type</h3>
                <p className="text-xs text-gray-500">
                  Specify land ownership and verify pin coordinates.
                </p>
              </div>

              <LocationAdjuster
                lat={lat}
                lng={lng}
                addressHint={addressHint}
                onCoordinatesChange={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                }}
                onAddressHintChange={setAddressHint}
              />

              {/* Land Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Land Ownership Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'public', label: 'Public Land', desc: 'Roadside, park, open ground', icon: Globe },
                    { id: 'temple', label: 'Temple / Sacred', desc: 'Mandir, sacred grove', icon: Sparkles },
                    { id: 'institution', label: 'Institution', desc: 'School, hospital, office', icon: Building2 },
                    { id: 'private', label: 'Private Property', desc: 'Residential garden/field', icon: Home },
                  ].map((lt) => {
                    const Icon = lt.icon;
                    const isSelected = landType === lt.id;
                    return (
                      <button
                        key={lt.id}
                        type="button"
                        onClick={() => {
                          setLandType(lt.id as LandType);
                          if (lt.id !== 'private') setPrivateOwnerConsent(false);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-forest-50 border-forest-600 shadow-sm ring-1 ring-forest-600'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-forest-700' : 'text-gray-500'}`} />
                          <span className="text-xs font-bold text-gray-900">{lt.label}</span>
                        </div>
                        <p className="text-[10px] text-gray-500">{lt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MANDATORY PRIVATE LAND CONSENT */}
              {landType === 'private' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-900">
                        Landowner Consent Required
                      </h4>
                      <p className="text-[11px] text-red-800 leading-relaxed mt-0.5">
                        To respect privacy and avoid trespassing, you must confirm that the owner has given permission to share this plant on Vriksha.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 pt-1.5 border-t border-red-200/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privateOwnerConsent}
                      onChange={(e) => setPrivateOwnerConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-red-300 text-forest-700 focus:ring-forest-600"
                    />
                    <span className="text-xs font-semibold text-red-900 leading-tight">
                      I confirm the landowner has agreed to share this plant&apos;s location with the community.
                    </span>
                  </label>
                </div>
              )}

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Beautiful old tree, plenty of low branches with fresh leaves for puja."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl outline-none focus:border-forest-600"
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {errorMessage}
                </p>
              )}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || (landType === 'private' && !privateOwnerConsent)}
                  className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Submit Plant'}</span>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold font-serif text-gray-900">
                  Plant Successfully Added!
                </h3>
                <p className="text-sm text-gray-600 max-w-sm mx-auto">
                  Thank you for contributing to your local green commons. You earned{' '}
                  <strong className="text-forest-800">+10 Green Points</strong>!
                </p>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-semibold text-sm rounded-xl shadow-md"
                >
                  Done &amp; View on Map
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
